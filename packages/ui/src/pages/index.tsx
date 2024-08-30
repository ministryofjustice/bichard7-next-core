import Layout from "components/Layout"
import Pagination from "components/Pagination"
import { CsrfTokenContext, CsrfTokenContextType } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { getCookie, setCookie } from "cookies-next"
import defaults from "defaults"
import AppliedFilters from "features/CourtCaseFilters/AppliedFilters"
import CourtCaseFilter from "features/CourtCaseFilters/CourtCaseFilter"
import CourtCaseWrapper from "features/CourtCaseFilters/CourtCaseFilterWrapper"
import CourtCaseList from "features/CourtCaseList/CourtCaseList"
import { Main } from "govuk-react"
import { isEqual } from "lodash"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import withCsrf from "middleware/withCsrf/withCsrf"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { courtCaseToDisplayPartialCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCountOfCasesByCaseAge from "services/getCountOfCasesByCaseAge"
import getDataSource from "services/getDataSource"
import getLastSwitchingFormSubmission from "services/getLastSwitchingFormSubmission"
import listCourtCases from "services/listCourtCases"
import unlockCourtCase from "services/unlockCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import {
  CaseListQueryParams,
  CaseState,
  LockedState,
  QueryOrder,
  Reason,
  SerializedCourtDateRange
} from "types/CaseListQueryParams"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Permission from "types/Permission"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import caseStateFilters from "utils/caseStateFilters"
import { formatFormInputDateString } from "utils/date/formattedDate"
import dedupeTriggerCodes from "utils/dedupeTriggerCodes"
import removeBlankQueryParams from "utils/deleteQueryParam/removeBlankQueryParams"
import getQueryStringCookieName from "utils/getQueryStringCookieName"
import { isPost } from "utils/http"
import { logUiDetails } from "utils/logUiDetails"
import { logCaseListRenderTime } from "utils/logging"
import { calculateLastPossiblePageNumber } from "utils/pagination/calculateLastPossiblePageNumber"
import { reasonOptions } from "utils/reasonOptions"
import redirectTo from "utils/redirectTo"
import shouldShowSwitchingFeedbackForm from "utils/shouldShowSwitchingFeedbackForm"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import { validateDateRange } from "utils/validators/validateDateRange"
import { validateQueryParams } from "utils/validators/validateQueryParams"

type Props = {
  build: string | null
  caseAge: string[]
  caseAgeCounts: Record<string, number>
  courtCases: DisplayPartialCourtCase[]
  csrfToken: string
  dateRange: SerializedCourtDateRange | null
  displaySwitchingSurveyFeedback: boolean
  environment: string | null
  oppositeOrder: QueryOrder
  queryStringCookieName: string
  totalCases: number
  user: DisplayFullUser
} & Omit<CaseListQueryParams, "allocatedToUserName" | "resolvedByUsername" | "courtDateRange">

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param === "desc"

// Remove characters that have an impact on queries.
const sanitise = (value: string) => value.replace(/[\\%_^]/g, "")

const extractSearchParamsFromQuery = (query: ParsedUrlQuery, currentUser: User): CaseListQueryParams => {
  // TODO: Actual validation of content with zod
  const reason =
    query.reason && validateQueryParams(query.reason) && reasonOptions.includes(query.reason as Reason)
      ? (query.reason as Reason)
      : Reason.All
  const caseAges = mapCaseAges(query.caseAge)
  const dateRange = validateDateRange({
    from: query.from,
    to: query.to
  })
  const defendantName = validateQueryParams(query.defendantName) ? sanitise(query.defendantName) : null
  const courtName = validateQueryParams(query.courtName) ? sanitise(query.courtName) : undefined
  const reasonCodes = validateQueryParams(query.reasonCodes)
    ? dedupeTriggerCodes(query.reasonCodes.split(" ").filter((reasonCode) => reasonCode !== "")).map((reasonCode) =>
        sanitise(reasonCode)
      )
    : []
  const ptiurn = validateQueryParams(query.ptiurn) ? sanitise(query.ptiurn) : undefined
  const lockedState: LockedState = validateQueryParams(query.lockedState)
    ? (query.lockedState as LockedState)
    : LockedState.All
  const allocatedToUserName = lockedState === LockedState.LockedToMe ? currentUser.username : null
  const caseState = caseStateFilters.includes(String(query.state)) ? (query.state as CaseState) : null
  const resolvedByUsername =
    caseState === "Resolved" && !currentUser.hasAccessTo[Permission.ListAllCases] ? currentUser.username : null
  const courtDateRange = caseAges || dateRange

  return {
    ...(defendantName && { defendantName: defendantName }),
    ...(courtName && { courtName: courtName }),
    ...(reasonCodes && { reasonCodes: reasonCodes }),
    ...(ptiurn && { ptiurn }),
    reason,
    maxPageItems: validateQueryParams(query.maxPageItems) ? +Number(query.maxPageItems) : defaults.maxPageItems,
    page: validateQueryParams(query.page) ? +Number(query.page) : 1,
    orderBy: validateQueryParams(query.orderBy) ? query.orderBy : "courtDate",
    order: validateOrder(query.order) && query.order == "asc" ? "asc" : "desc",
    ...(courtDateRange && { courtDateRange }),
    lockedState,
    ...(caseState && { caseState }),
    ...(resolvedByUsername && { resolvedByUsername }),
    ...(allocatedToUserName && { allocatedToUserName })
  }
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const startTime = new Date().getTime()
    const { req, currentUser, query, csrfToken } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const queryStringCookieName = getQueryStringCookieName(currentUser.username)

    const { unlockException, unlockTrigger, ...searchQueryParams } = query

    const caseListQueryParams = extractSearchParamsFromQuery(searchQueryParams, currentUser)

    const caseAges = [searchQueryParams.caseAge]
      .flat()
      .filter((t) => Object.keys(CaseAgeOptions).includes(String(t) as string)) as string[]

    const dataSource = await getDataSource()

    if (isPost(req) && typeof unlockException === "string") {
      const lockResult = await unlockCourtCase(dataSource, +unlockException, currentUser, UnlockReason.Exception)
      if (isError(lockResult)) {
        throw lockResult
      }
    }

    if (isPost(req) && typeof unlockTrigger === "string") {
      const lockResult = await unlockCourtCase(dataSource, +unlockTrigger, currentUser, UnlockReason.Trigger)
      if (isError(lockResult)) {
        throw lockResult
      }
    }

    // This needs to be here for the cookie to load/be sticky.
    // Do not remove!
    if (req.url) {
      const queryStringCookieValue = getCookie(getQueryStringCookieName(currentUser.username), { req })
      const [urlPath, urlQueryString] = req.url.split("?")
      if (urlPath === "/" && queryStringCookieValue && !urlQueryString) {
        return redirectTo(`${urlPath}?${queryStringCookieValue}`)
      }
    }

    const [caseAgeCounts, courtCases] = await Promise.all([
      getCountOfCasesByCaseAge(dataSource, currentUser),
      listCourtCases(dataSource, caseListQueryParams, currentUser)
    ])

    if (isError(caseAgeCounts)) {
      throw caseAgeCounts
    }

    if (isError(courtCases)) {
      throw courtCases
    }

    const oppositeOrder: QueryOrder = caseListQueryParams.order === "asc" ? "desc" : "asc"

    const lastPossiblePageNumber = calculateLastPossiblePageNumber(
      courtCases.totalCases,
      caseListQueryParams.maxPageItems
    )
    if ((caseListQueryParams.page ?? 1) > lastPossiblePageNumber) {
      if (req.url) {
        const [urlPath, urlQuery] = req.url.split("?")
        const parsedUrlQuery = new URLSearchParams(urlQuery)
        parsedUrlQuery.set("page", lastPossiblePageNumber.toString())
        return redirectTo(`${urlPath}?${parsedUrlQuery.toString()}`)
      }
    }

    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    logCaseListRenderTime(startTime, currentUser, caseListQueryParams)

    // Remove courtDateRange from the props because the dates don't serialise
    const { courtDateRange: _, ...caseListQueryProps } = caseListQueryParams
    return {
      props: {
        build: process.env.NEXT_PUBLIC_BUILD || null,
        caseAge: caseAges,
        caseAgeCounts: caseAgeCounts,
        courtCases: courtCases.result.map((courtCase: CourtCase) =>
          courtCaseToDisplayPartialCourtCaseDto(courtCase, currentUser)
        ),
        csrfToken,
        dateRange:
          !!caseListQueryParams.courtDateRange && !Array.isArray(caseListQueryParams.courtDateRange)
            ? {
                from: formatFormInputDateString(caseListQueryParams.courtDateRange.from),
                to: formatFormInputDateString(caseListQueryParams.courtDateRange.to)
              }
            : null,
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        environment: process.env.NEXT_PUBLIC_WORKSPACE || null,
        oppositeOrder,
        queryStringCookieName,
        totalCases: courtCases.totalCases,
        user: userToDisplayFullUserDto(currentUser),
        ...caseListQueryProps
      }
    }
  }
)

const Home: NextPage<Props> = (props) => {
  const router = useRouter()
  const {
    csrfToken,
    user,
    courtCases,
    totalCases,
    queryStringCookieName,
    displaySwitchingSurveyFeedback,
    environment,
    build,
    oppositeOrder,
    ...searchParams
  } = props

  useEffect(() => {
    logUiDetails(environment, build)
    const nonSavedParams = ["unlockTrigger", "unlockException"]
    const [, queryString] = router.asPath.split("?")

    const queryParams = new URLSearchParams(queryString)
    nonSavedParams.map((param) => queryParams.delete(param))

    setCookie(queryStringCookieName, queryParams.toString(), { path: "/" })

    const { pathname } = router
    const newQueryParams = removeBlankQueryParams(queryParams)
    nonSavedParams.map((param) => newQueryParams.delete(param))

    if (!isEqual(newQueryParams.toString(), queryParams.toString())) {
      router.push({ pathname, query: newQueryParams.toString() }, undefined, { shallow: true })
    }
  }, [router, queryStringCookieName, environment, build])

  const [csrfTokenContext] = useState<CsrfTokenContextType>({ csrfToken })
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <Head>
        <title>{"Bichard7 | Case List"}</title>
        <meta name="description" content="Bichard7 | Case List" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <Layout bichardSwitch={{ display: true, displaySwitchingSurveyFeedback }}>
            <Main />
            <CourtCaseWrapper
              filter={<CourtCaseFilter {...searchParams} />}
              appliedFilters={<AppliedFilters filters={{ ...searchParams }} />}
              courtCaseList={<CourtCaseList courtCases={courtCases} order={oppositeOrder} />}
              paginationTop={
                <Pagination
                  pageNum={searchParams.page}
                  casesPerPage={searchParams.maxPageItems}
                  totalCases={totalCases}
                  name="top"
                />
              }
              paginationBottom={
                <Pagination
                  pageNum={searchParams.page}
                  casesPerPage={searchParams.maxPageItems}
                  totalCases={totalCases}
                  name="bottom"
                />
              }
            />
          </Layout>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default Home
