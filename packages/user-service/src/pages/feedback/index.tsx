import BackLink from "components/BackLink"
import Button from "components/Button"
import ContactLink from "components/ContactLink"
import { ErrorSummary } from "components/ErrorSummary"
import Form from "components/Form"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import SuccessBanner from "components/SuccessBanner"
import config from "lib/config"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import useCustomStyles from "styles/useCustomStyles"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import User from "types/User"
import postFeedback from "useCases/postFeedback"
import { isPost } from "utils/http"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (isPost(req)) {
      const { feedback } = formData as { feedback: string }
      const feedbackResult = await postFeedback(feedback, currentUser?.emailAddress)
      if (isError(feedbackResult)) {
        return {
          props: {
            csrfToken,
            errorMessage: feedbackResult.message,
            successMessage: "",
            currentUser
          }
        }
      }
      return {
        props: {
          csrfToken,
          errorMessage: "",
          successMessage: "Feedback submitted successfully",
          currentUser
        }
      }
    }

    return {
      props: {
        csrfToken,
        errorMessage: "",
        successMessage: "",
        currentUser
      }
    }
  }
)

interface Props {
  csrfToken: string
  errorMessage: string
  successMessage: string
  currentUser?: Partial<User>
}

const ShareFeedback = ({ csrfToken, currentUser, errorMessage, successMessage }: Props) => {
  const classes = useCustomStyles()

  return (
    <>
      <Head>
        <title>{"Share feedback"}</title>
      </Head>
      <Layout user={currentUser}>
        <div className={`${classes["top-padding"]}`}>
          <ErrorSummary title="There is a problem" show={!!errorMessage}>
            {errorMessage}
          </ErrorSummary>

          {successMessage && <SuccessBanner>{successMessage}</SuccessBanner>}

          <h3 data-test="check-email" className="govuk-heading-xl">
            {"Share your feedback"}
          </h3>

          <Form method="post" csrfToken={csrfToken}>
            <div id="contact-support" className="govuk-label">
              <Paragraph>
                {"Please keep in mind that if you are experiencing any issues, you should either check our "}
                <ContactLink>{"FAQ page"}</ContactLink>
                {" or "}
                <Link href={`mailto:${config.supportEmail}`}>{"contact support"}</Link>
                {". Any issues raised via this page will not be handled."}
              </Paragraph>
            </div>
            <div id="feedback-hint" className="govuk-label">
              {"What improvements would you like to see?"}
            </div>
            <textarea
              className="govuk-textarea"
              id="feedback"
              name="feedback"
              rows={5}
              aria-describedby="feedback-hint"
            ></textarea>
            <Button noDoubleClick>{"Send feedback"}</Button>
          </Form>

          <BackLink href="/" />
        </div>
      </Layout>
    </>
  )
}

export default ShareFeedback
