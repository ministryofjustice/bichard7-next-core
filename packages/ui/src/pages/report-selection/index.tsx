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
import redirectTo from "utils/redirectTo"
import Layout from "../../components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "../../middleware"
import { userToDisplayFullUserDto } from "../../services/dto/userDto"
import AuthenticationServerSidePropsContext from "../../types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const canUseQualityAuditing = canUseTriggerAndExceptionQualityAuditing(currentUser)

    const props = {
      user: userToDisplayFullUserDto(currentUser),
      canUseTriggerAndExceptionQualityAuditing: canUseQualityAuditing
    }

    if (process.env.NODE_ENV === "production" || !userAccess(currentUser)[Permission.ViewReports]) {
      return redirectTo("/")
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  canUseTriggerAndExceptionQualityAuditing: boolean
}

function ReportSelectionPage(props: Readonly<Props>) {
  const { canUseTriggerAndExceptionQualityAuditing, user } = props
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
        <h1 hidden={true}>{"Search reports"}</h1>
        <ReportSelectionFilter />
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ReportSelectionPage
