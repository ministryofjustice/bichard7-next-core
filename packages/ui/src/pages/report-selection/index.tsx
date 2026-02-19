import { ReportSelectionFilter } from "components/SearchFilters/ReportSelectionFilter/ReportSelectionFilter"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { DisplayFullUser } from "types/display/Users"
import Layout from "../../components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "../../middleware"
import { userToDisplayFullUserDto } from "../../services/dto/userDto"
import AuthenticationServerSidePropsContext from "../../types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query } = context as AuthenticationServerSidePropsContext
    const { previousPath } = query as { previousPath: string }

    const props = {
      user: userToDisplayFullUserDto(currentUser),
      previousPath: previousPath ?? null
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  previousPath: string
}

const ReportSelectionPage: NextPage<Props> = ({ user, previousPath }: Props) => {
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  //const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(100)
  const router = useRouter()
  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Head>
        <title>{"Bichard7 | Select a report"}</title>
        <meta name="description" content="Bichard7 | Report selection" />
      </Head>
      <a className="govuk-back-link" href={`${router.basePath}` + previousPath} onClick={function noRefCheck() {}}>
        {"Back"}
      </a>
      <Layout
        bichardSwitch={{
          display: true,
          href: `/bichard-ui/ReturnToReportIndex`,
          displaySwitchingSurveyFeedback: true
        }}
      >
        <h1>{"Search reports"}</h1>
        <ReportSelectionFilter />
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ReportSelectionPage
