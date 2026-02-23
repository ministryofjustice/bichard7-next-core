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
import redirectTo from "utils/redirectTo"
import { IS_AUDIT_PAGE_ACCESSIBLE } from "config"
import AuditSearch from "features/AuditSearch/AuditSearch"

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

    const canUseQualityAuditing = canUseTriggerAndExceptionQualityAuditing(currentUser)

    if (!IS_AUDIT_PAGE_ACCESSIBLE || !canUseQualityAuditing) {
      return redirectTo("/")
    }

    return {
      props: {
        csrfToken,
        displaySwitchingSurveyFeedback: shouldShowSwitchingFeedbackForm(lastSwitchingFormSubmission ?? new Date(0)),
        user: userToDisplayFullUserDto(currentUser),
        canUseTriggerAndExceptionQualityAuditing: canUseQualityAuditing
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
            <AuditSearch
              resolvers={[
                { username: "usera", forenames: "Name", surname: "A" },
                { username: "userb", forenames: "Name", surname: "B" },
                { username: "userc", forenames: "Name", surname: "C" }
              ]}
              triggerTypes={["TRPR0010", "TRPR0011", "TRPR0012", "TRPR0013"]}
            />
          </Layout>
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default SearchPage
