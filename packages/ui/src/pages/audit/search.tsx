import { useState } from "react"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { CsrfTokenContext, useCsrfTokenContextState } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import withCsrf from "middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { DisplayFullUser } from "types/display/Users"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import shouldShowSwitchingFeedbackForm from "utils/shouldShowSwitchingFeedbackForm"
import getLastSwitchingFormSubmission from "services/getLastSwitchingFormSubmission"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import Layout from "components/Layout"
import { canUseTriggerAndExceptionQualityAuditing } from "features/flags/canUseTriggerAndExceptionQualityAuditing"

type Props = {
  csrfToken: string
  user: DisplayFullUser
  canUseTriggerAndExceptionQualityAuditing: boolean
  displaySwitchingSurveyFeedback: boolean
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext

    const dataSource = await getDataSource()
    const lastSwitchingFormSubmission = await getLastSwitchingFormSubmission(dataSource, currentUser.id)

    if (isError(lastSwitchingFormSubmission)) {
      throw lastSwitchingFormSubmission
    }

    return {
      props: {
        csrfToken,
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        user: userToDisplayFullUserDto(currentUser),
        canUseTriggerAndExceptionQualityAuditing: canUseTriggerAndExceptionQualityAuditing(currentUser)
      }
    }
  }
)

const SearchPage: NextPage<Props> = (props) => {
  const { csrfToken, canUseTriggerAndExceptionQualityAuditing, displaySwitchingSurveyFeedback, user } = props

  const csrfTokenContext = useCsrfTokenContextState(csrfToken)
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <Head>
        <title>{"Bichard7 | Audit Search"}</title>
        <meta name="description" content="Bichard7 | Audit Search" />
      </Head>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          <Layout
            canUseTriggerAndExceptionQualityAuditing={canUseTriggerAndExceptionQualityAuditing}
            bichardSwitch={{ display: true, displaySwitchingSurveyFeedback }}
          >
            <h1>{"Audit Search"}</h1>
          </Layout>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default SearchPage
