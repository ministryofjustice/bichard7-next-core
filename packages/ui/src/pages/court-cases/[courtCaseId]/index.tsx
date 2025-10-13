import Permission from "@moj-bichard7/common/types/Permission"
import Layout from "components/Layout"
import { CourtCaseContext, useCourtCaseContextState } from "context/CourtCaseContext"
import { CsrfTokenContext, useCsrfTokenContextState } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { PreviousPathContext, PreviousPathContextType } from "context/PreviousPathContext"
import { setCookie } from "cookies-next"
import { OptionsType } from "cookies-next/lib/types"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import Header from "features/CourtCaseDetails/Header"
import { canUseTriggerAndExceptionQualityAuditing } from "features/flags/canUseTriggerAndExceptionQualityAuditing"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import withCsrf from "middleware/withCsrf/withCsrf"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import addNote from "services/addNote"
import ApiClient from "services/api/ApiClient"
import BichardApiV1 from "services/api/BichardApiV1"
import { ApiEndpoints, canUseApiEndpoint } from "services/api/canUseEndpoint"
import { canReallocate, canResolveOrSubmit } from "services/case"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import getLastSwitchingFormSubmission from "services/getLastSwitchingFormSubmission"
import lockCourtCase from "services/lockCourtCase"
import { createMqConfig, StompitMqGateway } from "services/mq"
import resolveTriggers from "services/resolveTriggers"
import resubmitCourtCase from "services/resubmitCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import { UpdateResult } from "typeorm"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import getCaseDetailsCookieName from "utils/getCaseDetailsCookieName"
import { isPost } from "utils/http"
import logger from "utils/logger"
import { logRenderTime } from "utils/logging"
import redirectTo from "utils/redirectTo"
import shouldShowSwitchingFeedbackForm from "utils/shouldShowSwitchingFeedbackForm"

const mqGatewayConfig = createMqConfig()
const mqGateway = new StompitMqGateway(mqGatewayConfig)

const allIssuesCleared = (courtCase: CourtCase | DisplayFullCourtCase, triggerToResolve: number[], user: User) => {
  const triggersResolved = user.hasAccessTo[Permission.Triggers]
    ? courtCase.triggers.filter((t) => t.status === "Unresolved").length === triggerToResolve.length
    : true
  const exceptionsResolved = user.hasAccessTo[Permission.Exceptions] ? courtCase.errorStatus !== "Unresolved" : true
  return triggersResolved && exceptionsResolved
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const startTime = new Date().getTime()
    const { req, currentUser, query, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { courtCaseId, lock, resolveTrigger, resubmitCase, previousPath } = query as {
      courtCaseId: string
      lock: string
      resolveTrigger: string | string[] | undefined
      resubmitCase: string
      previousPath: string
    }
    const caseDetailsCookieName = getCaseDetailsCookieName(currentUser.username)

    const dataSource = await getDataSource()

    const loadLockedBy = true

    const useApiForCaseDetails = canUseApiEndpoint(ApiEndpoints.CaseDetails, currentUser.visibleForces)
    const useApiForCaseResubmit = canUseApiEndpoint(ApiEndpoints.CaseResubmit, currentUser.visibleForces)

    let apiGateway: BichardApiV1 | undefined = undefined

    if (useApiForCaseDetails || useApiForCaseResubmit) {
      const jwt = req.cookies[".AUTH"] as string
      const apiClient = new ApiClient(jwt)
      apiGateway = new BichardApiV1(apiClient)
    }

    let courtCase
    if (!useApiForCaseDetails) {
      courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

      if (isError(courtCase)) {
        throw courtCase
      }

      if (!courtCase) {
        return {
          notFound: true
        }
      }
    }

    const triggersToResolve = []
    if (typeof resolveTrigger === "string" && !Number.isNaN(+resolveTrigger)) {
      triggersToResolve.push(+resolveTrigger)
    } else if (Array.isArray(resolveTrigger)) {
      resolveTrigger.forEach((triggerId) => {
        if (!Number.isNaN(+triggerId)) {
          triggersToResolve.push(+triggerId)
        }
      })
    }

    if (isPost(req) && triggersToResolve.length > 0) {
      const courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

      if (isError(courtCase)) {
        throw courtCase
      } else if (!courtCase) {
        return {
          notFound: true
        }
      }

      const updateTriggerResult = await resolveTriggers(
        dataSource,
        triggersToResolve.map((triggerId) => +triggerId),
        +courtCaseId,
        currentUser
      ).catch((error) => error)

      if (isError(updateTriggerResult)) {
        throw updateTriggerResult
      }

      if (allIssuesCleared(courtCase, triggersToResolve, currentUser)) {
        return redirectTo(`/`)
      }
    }

    if (isPost(req) && resubmitCase === "true") {
      if (useApiForCaseResubmit && apiGateway) {
        logger.info("[API] Using API to resubmit")
        const resubmitResult = await apiGateway.resubmitCase(Number(courtCaseId))

        if (isError(resubmitResult)) {
          const error = resubmitResult
          if (/404/.test(error.message)) {
            return {
              notFound: true
            }
          }
          throw error
        }
      } else {
        const { amendments } = formData as { amendments: string }

        const resubmitCourtCaseResult = await resubmitCourtCase(
          dataSource,
          mqGateway,
          JSON.parse(amendments),
          +courtCaseId,
          currentUser
        )

        if (isError(resubmitCourtCaseResult)) {
          throw resubmitCourtCaseResult
        }
      }
    }

    if (isPost(req)) {
      const { noteText } = formData as { noteText: string }
      if (noteText) {
        const { isSuccessful, ValidationException } = await addNote(
          dataSource,
          +courtCaseId,
          currentUser.username,
          noteText
        )
        if (!isSuccessful) {
          throw new Error(ValidationException)
        }
      }
    }

    let lockResult: UpdateResult | Error | undefined

    if (isPost(req) && lock === "false") {
      lockResult = await unlockCourtCase(
        dataSource,
        +courtCaseId,
        currentUser,
        UnlockReason.TriggerAndException,
        useApiForCaseResubmit
      )
    } else if (
      !useApiForCaseDetails &&
      (currentUser.hasAccessTo[Permission.Exceptions] || currentUser.hasAccessTo[Permission.Triggers])
    ) {
      lockResult = await lockCourtCase(dataSource, +courtCaseId, currentUser)
    }

    if (isError(lockResult)) {
      throw lockResult
    }

    // Fetch the record from the database after updates
    if (!useApiForCaseDetails) {
      courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

      if (isError(courtCase)) {
        throw courtCase
      }

      if (!courtCase) {
        return {
          notFound: true
        }
      }
    }

    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    let apiCase: DisplayFullCourtCase | Error | undefined

    if (useApiForCaseDetails && apiGateway) {
      logger.info("[API] Using API to fetch case details")
      apiCase = await apiGateway.fetchCase(Number(courtCaseId))

      if (isError(apiCase)) {
        const error = apiCase
        if (/404/.test(error.message)) {
          return {
            notFound: true
          }
        }
        throw error
      }
    }

    logRenderTime(startTime, "caseView")

    const caseDto = useApiForCaseDetails
      ? (apiCase as DisplayFullCourtCase)
      : courtCaseToDisplayFullCourtCaseDto(courtCase as CourtCase, currentUser)

    return {
      props: {
        csrfToken,
        caseDetailsCookieName,
        previousPath: previousPath ?? null,
        user: userToDisplayFullUserDto(currentUser),
        courtCase: caseDto,
        canReallocate: canReallocate(currentUser.username, caseDto),
        canResolveAndSubmit: canResolveOrSubmit(currentUser, caseDto),
        canUseTriggerAndExceptionQualityAuditing: canUseTriggerAndExceptionQualityAuditing(currentUser),
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        allIssuesCleared: allIssuesCleared(caseDto, triggersToResolve, currentUser)
      }
    }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  canReallocate: boolean
  canResolveAndSubmit: boolean
  canUseTriggerAndExceptionQualityAuditing: boolean
  csrfToken: string
  displaySwitchingSurveyFeedback: boolean
  previousPath: string
  caseDetailsCookieName: string
  allIssuesCleared: boolean
}

const CourtCaseDetailsPage: NextPage<Props> = ({
  courtCase,
  user,
  canReallocate,
  canResolveAndSubmit,
  canUseTriggerAndExceptionQualityAuditing,
  displaySwitchingSurveyFeedback,
  csrfToken,
  previousPath,
  caseDetailsCookieName,
  allIssuesCleared
}: Props) => {
  const csrfTokenContext = useCsrfTokenContextState(csrfToken)
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  const courtCaseContext = useCourtCaseContextState(courtCase)
  const [previousPathContext] = useState<PreviousPathContextType>({ previousPath })

  useEffect(() => {
    setCookie(caseDetailsCookieName, `${courtCase.errorId}?previousPath=${encodeURIComponent(previousPath)}`, {
      path: "/"
    } as OptionsType)
  }, [caseDetailsCookieName, courtCase.errorId, previousPath])

  return (
    <>
      <Head>
        <title>{"Bichard7 | Case Details"}</title>
        <meta name="description" content="Bichard7 | Case Details" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <CourtCaseContext.Provider value={courtCaseContext}>
            <PreviousPathContext.Provider value={previousPathContext}>
              <Layout
                bichardSwitch={{
                  display: true,
                  href: `/bichard-ui/SelectRecord?unstick=true&error_id=${courtCase.errorId}`,
                  displaySwitchingSurveyFeedback
                }}
              >
                <Header canReallocate={canReallocate} />
                <CourtCaseDetails
                  canResolveAndSubmit={canResolveAndSubmit}
                  canUseTriggerAndExceptionQualityAuditing={canUseTriggerAndExceptionQualityAuditing}
                  allIssuesCleared={allIssuesCleared}
                />
              </Layout>
            </PreviousPathContext.Provider>
          </CourtCaseContext.Provider>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default CourtCaseDetailsPage
