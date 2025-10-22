import BackLink from "components/BackLink"
import Button from "components/Button"
import { ErrorSummary } from "components/ErrorSummary"
import Form from "components/Form"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import { RadioItem } from "components/RadioItem"
import SuccessBanner from "components/SuccessBanner"
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
      const { feedback, satisfactionRating } = formData as { feedback: string; satisfactionRating: string }

      const feedbackResult = await postFeedback(feedback, satisfactionRating)
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
            <div id="contact-support" className="govuk-label govuk-!-padding-bottom-7">
              <Paragraph>{"Tell us about your experience of using Bichard7 to help us improve the service."}</Paragraph>
              <Paragraph>{"Your responses are anonymous and are used to make future improvements."}</Paragraph>
              <Paragraph>{"We do not reply to feedback."}</Paragraph>
              <Paragraph>
                {"For account issues or support use the "}
                <Link href="#">{"help guide (opens in new tab)"}</Link>
                {"."}
              </Paragraph>
            </div>

            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-!-font-weight-bold">
                {"Overall, how did you feel about using Bichard7 today?"}
              </legend>
              <div id="email-hint" className="govuk-hint">
                {"Select one"}
              </div>
              <div className="govuk-radios" data-module="govuk-radios">
                <RadioItem
                  value="very-satisfied"
                  id="satisfactionRating-1"
                  name="satisfactionRating"
                  text="Very satisfied"
                />
                <RadioItem value="satisfied" id="satisfactionRating-2" name="satisfactionRating" text="Satisfied" />
                <RadioItem
                  value="neither-satisfied-or-dissatisfied"
                  id="satisfactionRating-3"
                  name="satisfactionRating"
                  text="Neither satisfied or dissatisfied"
                />
                <RadioItem
                  value="neither-satisfied-or-dissatisfied"
                  id="satisfactionRating-4"
                  name="satisfactionRating"
                  text="Dissatisfied"
                />
                <RadioItem
                  value="very-dissatisfied"
                  id="satisfactionRating-5"
                  name="satisfactionRating"
                  text="Very dissatisfied"
                />
              </div>
            </fieldset>

            <div id="feedback-hint" className="govuk-label govuk-!-font-weight-bold govuk-!-padding-top-5">
              {"Tell us how we can improve Bichard7"}
            </div>
            <div id="email-hint" className="govuk-hint">
              {
                "Do not include any personal or case information, for example your name, email address, force or case details"
              }
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
