import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import type { ParsedUrlQuery } from "node:querystring"

import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import { type AuditCasesQuery, AuditCasesQuerySchema } from "@moj-bichard7/common/contracts/AuditCasesQuery"

import { useState } from "react"
import Head from "next/head"

import { withAuthentication, withMultipleServerSideProps } from "middleware"
import withCsrf from "middleware/withCsrf/withCsrf"
import { IS_AUDIT_PAGE_ACCESSIBLE } from "config"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import type { DisplayFullUser } from "types/display/Users"
import { isApiError } from "types/ApiError"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import getLastSwitchingFormSubmission from "services/getLastSwitchingFormSubmission"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import ApiClient from "services/api/ApiClient"
import BichardApiV1 from "services/api/BichardApiV1"
import { canUseTriggerAndExceptionQualityAuditing } from "features/flags/canUseTriggerAndExceptionQualityAuditing"
import AuditCaseList from "features/AuditCaseList/AuditCaseList"
import redirectTo from "utils/redirectTo"
import shouldShowSwitchingFeedbackForm from "utils/shouldShowSwitchingFeedbackForm"
import { CsrfTokenContext, useCsrfTokenContextState } from "context/CsrfTokenContext"
import { CurrentUserContext, type CurrentUserContextType } from "context/CurrentUserContext"
import Layout from "components/Layout"
import { ProgressBar } from "../../../components/ProgressBar"
import { AuditCaseListContainer } from "../../../features/AuditCaseList/AuditCaseList.styles"
import Pagination from "../../../components/Pagination"

interface Props {
  csrfToken: string
  user: DisplayFullUser
  audit: AuditWithProgressDto
  auditCases: AuditCasesMetadata
  auditCasesQuery: AuditCasesQuery
  displaySwitchingSurveyFeedback: boolean
  canUseTriggerAndExceptionQualityAuditing: boolean
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser, query, csrfToken } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    const dataSource = await getDataSource()
    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    const canUseQualityAuditing = canUseTriggerAndExceptionQualityAuditing(currentUser)

    if (!IS_AUDIT_PAGE_ACCESSIBLE || !canUseQualityAuditing) {
      return redirectTo("/")
    }

    const { auditId } = query as {
      auditId: string
    }
    const auditCasesQuery = AuditCasesQuerySchema.parse(query)

    const jwt = req.cookies[".AUTH"] as string
    const apiClient = new ApiClient(jwt)
    const apiGateway = new BichardApiV1(apiClient)

    const [audit, auditCases] = await Promise.all([
      apiGateway.fetchAuditById(Number(auditId)),
      apiGateway.fetchAuditCases(Number(auditId), auditCasesQuery)
    ])

    if (isError(audit)) {
      const error = audit
      if (isApiError(error) && error.status === 404) {
        return {
          notFound: true
        }
      }
      throw error
    }

    if (isError(auditCases)) {
      throw auditCases
    }

    return {
      props: {
        csrfToken,
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        user: userToDisplayFullUserDto(currentUser),
        audit,
        auditCases,
        auditCasesQuery,
        canUseTriggerAndExceptionQualityAuditing: canUseQualityAuditing
      }
    }
  }
)

const Page: NextPage<Props> = ({
  csrfToken,
  user,
  audit,
  auditCases,
  auditCasesQuery,
  displaySwitchingSurveyFeedback,
  canUseTriggerAndExceptionQualityAuditing
}) => {
  const csrfTokenContext = useCsrfTokenContextState(csrfToken)
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <Head>
        <title>{"Bichard7 | Audit"}</title>
        <meta name="description" content="Bichard7 | Audit" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <Layout
            canUseTriggerAndExceptionQualityAuditing={canUseTriggerAndExceptionQualityAuditing}
            bichardSwitch={{ display: true, displaySwitchingSurveyFeedback }}
          >
            <ProgressBar currentCount={audit.auditedCases} maxCount={audit.totalCases} labelType="percentage" />
            <AuditCaseListContainer>
              <Pagination
                pageNum={auditCasesQuery.pageNum}
                casesPerPage={auditCasesQuery.maxPerPage}
                totalCases={audit.totalCases}
                name="top"
              />
              <AuditCaseList auditId={audit.auditId} auditCases={auditCases.cases} />
              <Pagination
                pageNum={auditCasesQuery.pageNum}
                casesPerPage={auditCasesQuery.maxPerPage}
                totalCases={audit.totalCases}
                name="bottom"
              />
            </AuditCaseListContainer>
          </Layout>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default Page
