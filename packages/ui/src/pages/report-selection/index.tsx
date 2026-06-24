import ApiClient from "@/services/api/ApiClient"
import BichardApiV1 from "@/services/api/BichardApiV1"
import AuditResolvedBy from "@/types/AuditResolvedBy"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { canUseTriggerAndExceptionQualityAuditing } from "features/flags/canUseTriggerAndExceptionQualityAuditing"
import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { DisplayFullUser } from "types/display/Users"
import { isError } from "types/Result"
import redirectTo from "utils/redirectTo"
import Layout from "../../components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "../../middleware"
import { userToDisplayFullUserDto } from "../../services/dto/userDto"
import AuthenticationServerSidePropsContext from "../../types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser } = context as AuthenticationServerSidePropsContext

    const canUseQualityAuditing = canUseTriggerAndExceptionQualityAuditing(currentUser)

    const props: Props = {
      user: userToDisplayFullUserDto(currentUser),
      canUseTriggerAndExceptionQualityAuditing: canUseQualityAuditing,
      resolvedBy: []
    }

    if (!userAccess(currentUser)[Permission.ViewReports]) {
      return redirectTo("/")
    }

    const jwt = req.cookies[".AUTH"] as string
    const apiClient = new ApiClient(jwt)
    const apiGateway = new BichardApiV1(apiClient)

    const usersResponse = await apiGateway.fetchUsers()

    if (!isError(usersResponse) && !!usersResponse) {
      props.resolvedBy = usersResponse.users
        .filter((u) => canUseTriggerAndExceptionQualityAuditing(u))
        .map((u) => ({
          username: u.username,
          forenames: u.forenames ?? "",
          surname: u.surname ?? "",
          deleted: u.deleted
        }))
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  canUseTriggerAndExceptionQualityAuditing: boolean
  resolvedBy: AuditResolvedBy[]
}

function ReportSelectionPage(props: Readonly<Props>) {
  const { canUseTriggerAndExceptionQualityAuditing, user, resolvedBy } = props
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Head>
        <title>{"Bichard7 | Select a report"}</title>
        <meta name="description" content="Bichard7 | Report selection" />
      </Head>
      <Layout
        bichardSwitch={{
          display: true,
          href: `/bichard-ui/ReturnToReportIndex`,
          displaySwitchingSurveyFeedback: true
        }}
        canUseTriggerAndExceptionQualityAuditing={canUseTriggerAndExceptionQualityAuditing}
      >
        <h1 className={"govuk-visually-hidden"}>{"Reports"}</h1>
        <ReportSelectionFilter resolvedBy={resolvedBy} />
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ReportSelectionPage
