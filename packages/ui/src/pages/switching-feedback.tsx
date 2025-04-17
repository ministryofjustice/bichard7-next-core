import { LinkButton } from "components/Buttons/LinkButton"
import Layout from "components/Layout"
import { SkipLink, SwitchingFeedbackButtonContainer } from "components/SwitchingFeedbackHeader/Links.styles"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { SurveyFeedbackType, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import Form from "../components/Form"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"

interface Props {
  user: DisplayFullUser
  csrfToken: string
  previousPath: string
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, csrfToken } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const {
      previousPath,
      isSkipped,
      redirectTo: redirectToUrl
    } = query as { previousPath: string; isSkipped?: string; redirectTo?: string }

    if (!redirectToUrl) {
      throw new Error("no redirectTo URL")
    }

    const props = {
      user: userToDisplayFullUserDto(currentUser),
      previousPath,
      csrfToken
    }

    if (isPost(req)) {
      const dataSource = await getDataSource()

      if (isSkipped === "true") {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          userId: currentUser.id,
          response: { skipped: true } as SwitchingFeedbackResponse
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(redirectToUrl)
        } else {
          throw result
        }
      }
    }

    return { props }
  }
)

const SwitchingFeedbackPage: NextPage<Props> = ({ user, previousPath, csrfToken }: Props) => {
  const [skipUrl, setSkipUrl] = useState<URL | null>(null)
  const router = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.append("isSkipped", "true")
    setSkipUrl(url)
  }, [])

  const emailSubject = "Feedback: <Subject here>"
  const emailBody =
    "Please describe the issues you have experienced, including Username and Force - the more detail the better. If you have any screenshots, please attach them to the email."
  const emailHref = `mailto:moj-bichard7@madetech.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  const handleSendEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (process.env.WORKSPACE !== "production") {
      window.location.assign("/bichard-ui/RefreshListNoRedirect")
    }

    window.location.assign(emailHref)
    window.location.assign("/bichard-ui/RefreshListNoRedirect")
  }

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Layout>
        <Head>
          <title>{"Bichard7 | Report an issue using new Bichard"}</title>
          <meta name="description" content="Bichard7 | User switching version feedback" />
        </Head>

        <a className="govuk-back-link" href={`${router.basePath}` + previousPath} onClick={function noRefCheck() {}}>
          {"Back"}
        </a>

        <h1 className="govuk-heading-l">{"Share your feedback"}</h1>

        <p className="govuk-body">
          {
            "You have chosen to switch back to old Bichard. Could you share why? Please email us and outline the details of any issues you have experienced. It is helpful for us to receive feedback so that we can make improvements."
          }
        </p>
        <p className="govuk-body">{"Some examples of feedback are:"}</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>{"finding issues or bugs in the new version of Bichard (please be specific)"}</li>
          <li>{"having a preference for the old version of Bichard"}</li>
          <li>{"any other reason"}</li>
        </ul>
        <SwitchingFeedbackButtonContainer>
          <LinkButton href={emailHref} className="send-feedback-email" onClick={handleSendEmailClick}>
            {"Send feedback email"}
          </LinkButton>
          <Form method="POST" action={skipUrl?.search} csrfToken={csrfToken}>
            <SkipLink id="skip-feedback" type="submit" className="govuk-link">
              {"Skip feedback"}
            </SkipLink>
          </Form>
        </SwitchingFeedbackButtonContainer>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default SwitchingFeedbackPage
