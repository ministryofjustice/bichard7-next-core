import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"

import Permission from "@moj-bichard7/common/types/Permission"
import ConditionalRender from "components/ConditionalRender"
import Layout from "components/Layout"
import { CourtCaseContext, useCourtCaseContextState } from "context/CourtCaseContext"
import { CsrfTokenContext, CsrfTokenContextType } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { PreviousPathContext, PreviousPathContextType } from "context/PreviousPathContext"
import { setCookie } from "cookies-next"
import { OptionsType } from "cookies-next/lib/types"
import CourtCaseDetails from "features/CourtCaseDetails/CourtCaseDetails"
import CourtCaseDetailsSummaryBox from "features/CourtCaseDetails/CourtCaseDetailsSummaryBox"
import Header from "features/CourtCaseDetails/Header"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import addNote from "services/addNote"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import lockCourtCase from "services/lockCourtCase"
import resolveTriggers from "services/resolveTriggers"
import resubmitCourtCase from "services/resubmitCourtCase"
import unlockCourtCase from "services/unlockCourtCase"
import { UpdateResult } from "typeorm"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import getCaseDetailsCookieName from "utils/getCaseDetailsCookieName"
import { isPost } from "utils/http"
import { logRenderTime } from "utils/logging"
import notSuccessful from "utils/notSuccessful"
import redirectTo from "utils/redirectTo"

import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CourtCase from "../../../services/entities/CourtCase"
import User from "../../../services/entities/User"
import getLastSwitchingFormSubmission from "../../../services/getLastSwitchingFormSubmission"
import { AttentionBanner, AttentionContainer } from "../../../styles/index.styles"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import shouldShowSwitchingFeedbackForm from "../../../utils/shouldShowSwitchingFeedbackForm"

const allIssuesCleared = (courtCase: CourtCase, triggerToResolve: number[], user: User) => {
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
    const { csrfToken, currentUser, formData, query, req } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { courtCaseId, lock, previousPath, resolveTrigger, resubmitCase } = query as {
      courtCaseId: string
      lock: string
      previousPath: string
      resolveTrigger: string | string[] | undefined
      resubmitCase: string
    }
    const caseDetailsCookieName = getCaseDetailsCookieName(currentUser.username)

    const dataSource = await getDataSource()

    const loadLockedBy = true

    let courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    let lockResult: Error | undefined | UpdateResult

    if (isPost(req) && lock === "false") {
      lockResult = await unlockCourtCase(dataSource, +courtCaseId, currentUser, UnlockReason.TriggerAndException)
    } else if (currentUser.hasAccessTo[Permission.Exceptions] || currentUser.hasAccessTo[Permission.Triggers]) {
      lockResult = await lockCourtCase(dataSource, +courtCaseId, currentUser)
    }

    if (isError(lockResult)) {
      throw lockResult
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
      const { amendments } = formData as { amendments: string }

      const parsedAmendments = JSON.parse(amendments)

      const updatedAmendments =
        Object.keys(parsedAmendments).length > 0 ? parsedAmendments : { noUpdatesResubmit: true }

      const amendedCase = await resubmitCourtCase(dataSource, updatedAmendments, +courtCaseId, currentUser)

      if (isError(amendedCase)) {
        throw amendedCase
      }
    }

    if (isPost(req)) {
      const { noteText } = formData as { noteText: string }
      if (noteText) {
        const { Exception, isSuccessful, ValidationException } = await addNote(
          dataSource,
          +courtCaseId,
          currentUser.username,
          noteText
        )
        if (!isSuccessful) {
          return notSuccessful(ValidationException ?? Exception?.message ?? "")
        }
      }
    }

    // Fetch the record from the database after updates
    courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser, loadLockedBy)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    logRenderTime(startTime, "caseView")

    return {
      props: {
        canReallocate: courtCase.canReallocate(currentUser.username),
        canResolveAndSubmit: courtCase.canResolveOrSubmit(currentUser),
        caseDetailsCookieName,
        courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase, currentUser),
        csrfToken,
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        isLockedByCurrentUser: courtCase.isLockedByCurrentUser(currentUser.username),
        previousPath: previousPath ?? null,
        user: userToDisplayFullUserDto(currentUser)
      }
    }
  }
)

interface Props {
  canReallocate: boolean
  canResolveAndSubmit: boolean
  caseDetailsCookieName: string
  courtCase: DisplayFullCourtCase
  csrfToken: string
  displaySwitchingSurveyFeedback: boolean
  isLockedByCurrentUser: boolean
  previousPath: string
  user: DisplayFullUser
}

const CourtCaseDetailsPage: NextPage<Props> = ({
  canReallocate,
  canResolveAndSubmit,
  caseDetailsCookieName,
  courtCase,
  csrfToken,
  displaySwitchingSurveyFeedback,
  isLockedByCurrentUser,
  previousPath,
  user
}: Props) => {
  const [csrfTokenContext] = useState<CsrfTokenContextType>({ csrfToken })
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
        <meta content="Bichard7 | Case Details" name="description" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <CourtCaseContext.Provider value={courtCaseContext}>
            <PreviousPathContext.Provider value={previousPathContext}>
              <Layout
                bichardSwitch={{
                  display: true,
                  displaySwitchingSurveyFeedback,
                  href: `/bichard-ui/SelectRecord?unstick=true&error_id=${courtCase.errorId}`
                }}
              >
                <ConditionalRender isRendered={courtCase.phase !== 1}>
                  <AttentionContainer className={`attention-container govuk-tag govuk-!-width-full`}>
                    <div className="govuk-tag">{"Attention:"}</div>
                    <AttentionBanner className={`attention-banner govuk-tag`}>
                      {
                        "This case can not be reallocated within new bichard; Switch to the old bichard to reallocate this case."
                      }
                    </AttentionBanner>
                  </AttentionContainer>
                </ConditionalRender>
                <Header canReallocate={canReallocate} />
                <CourtCaseDetailsSummaryBox />
                <CourtCaseDetails
                  canResolveAndSubmit={canResolveAndSubmit}
                  isLockedByCurrentUser={isLockedByCurrentUser}
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
