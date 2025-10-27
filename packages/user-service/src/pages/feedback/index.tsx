import Button from "components/Button"
import { ErrorSummary } from "components/ErrorSummary"
import Form from "components/Form"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import { RadioItem } from "components/RadioItem"
import { TextAreaWithCharCount } from "components/TextAreaWithCharCount"
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
import createRedirectResponse from "utils/createRedirectResponse"
import { isPost } from "utils/http"

const feedbackCharLimit = 800

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (isPost(req)) {
      const { feedback, rating } = formData as { feedback: string; rating: string }
      const ratingHasError = !rating
      const feedbackIsEmpty = !feedback
      const feedbackIsOverCharLimit = feedback.length > feedbackCharLimit
      const feedbackHasError = feedbackIsEmpty || feedbackIsOverCharLimit

      if (ratingHasError || feedbackHasError) {
        return {
          props: {
            csrfToken,
            errorMessage: "",
            currentUser,
            fields: {
              feedback: {
                isEmpty: feedbackIsEmpty,
                isOverCharLimit: feedbackIsOverCharLimit,
                hasError: feedbackHasError,
                value: feedback ?? null
              },
              rating: { hasError: ratingHasError, value: rating ?? null }
            }
          }
        }
      }

      const feedbackResult = await postFeedback(feedback, rating)
      if (isError(feedbackResult)) {
        return {
          props: {
            csrfToken,
            errorMessage: feedbackResult.message,
            currentUser
          }
        }
      }

      return createRedirectResponse("feedback/confirmation")
    }

    return {
      props: {
        csrfToken,
        errorMessage: "",
        currentUser
      }
    }
  }
)

interface Props {
  csrfToken: string
  errorMessage: string
  currentUser?: Partial<User>
  fields?: {
    feedback: {
      isEmpty: boolean
      isOverCharLimit: boolean
      hasError: boolean
      value: string
    }
    rating: {
      hasError: boolean
      value: string
    }
  }
}

const ShareFeedback = ({ csrfToken, currentUser, errorMessage, fields }: Props) => {
  const classes = useCustomStyles()
  const hasErrors = fields?.rating.hasError || fields?.feedback.hasError || !!errorMessage
  const feedbackEmptyErrorMessage = "Provide feedback"
  const feedbackOverCharLimitErrorMessage = `Feedback must be ${feedbackCharLimit} characters or less`

  return (
    <>
      <Head>
        <title>{"Share feedback"}</title>
      </Head>
      <Layout user={currentUser} showPhaseBanner={false}>
        <div className={`${classes["top-padding"]}`}>
          {hasErrors && (
            <ErrorSummary title="There is a problem" show>
              <ul className="govuk-list govuk-error-summary__list">
                {fields?.rating.hasError && (
                  <li>
                    <a href="#rating-1">{"Select  how you feel about using Bichard7"}</a>
                  </li>
                )}
                {fields?.feedback.isEmpty && (
                  <li>
                    <a href="#feedback">{feedbackEmptyErrorMessage}</a>
                  </li>
                )}
                {fields?.feedback.isOverCharLimit && (
                  <li>
                    <a href="#feedback">{feedbackOverCharLimitErrorMessage}</a>
                  </li>
                )}
                {!!errorMessage && <li>{errorMessage}</li>}
              </ul>
            </ErrorSummary>
          )}

          <h3 className="govuk-heading-xl">{"Share your feedback"}</h3>

          <Form method="post" csrfToken={csrfToken}>
            <div id="contact-support" className="govuk-label govuk-!-padding-bottom-7">
              <Paragraph>{"Tell us about your experience of using Bichard7 to help us improve the service."}</Paragraph>
              <Paragraph>{"Your responses are anonymous and are used to make future improvements."}</Paragraph>
              <Paragraph>{"We do not reply to feedback."}</Paragraph>
              <Paragraph>
                {"For account issues or support use the "}
                <Link href="/faq">{"help guide (opens in new tab)"}</Link>
                {"."}
              </Paragraph>
            </div>

            <div className={`govuk-form-group ${fields?.rating.hasError ? "govuk-form-group--error" : ""}`}>
              <fieldset className="govuk-fieldset" id="rating">
                <legend className="govuk-fieldset__legend govuk-!-font-weight-bold">
                  {"Overall, how did you feel about using Bichard7 today?"}
                </legend>
                <div id="email-hint" className="govuk-hint">
                  {"Select one"}
                </div>
                {fields?.rating.hasError && (
                  <p id="radioEmpty-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">{"Error:"}</span>{" "}
                    {"Select  how you feel about using Bichard7"}
                  </p>
                )}
                <div className="govuk-radios" data-module="govuk-radios">
                  <RadioItem
                    value="very-satisfied"
                    id="rating-1"
                    name="rating"
                    text="Very satisfied"
                    defaultChecked={fields?.rating.value === "very-satisfied"}
                  />
                  <RadioItem
                    value="satisfied"
                    id="rating-2"
                    name="rating"
                    text="Satisfied"
                    defaultChecked={fields?.rating.value === "satisfied"}
                  />
                  <RadioItem
                    value="neither-satisfied-or-dissatisfied"
                    id="rating-3"
                    name="rating"
                    text="Neither satisfied or dissatisfied"
                    defaultChecked={fields?.rating.value === "neither-satisfied-or-dissatisfied"}
                  />
                  <RadioItem
                    value="dissatisfied"
                    id="rating-4"
                    name="rating"
                    text="Dissatisfied"
                    defaultChecked={fields?.rating.value === "dissatisfied"}
                  />
                  <RadioItem
                    value="very-dissatisfied"
                    id="rating-5"
                    name="rating"
                    text="Very dissatisfied"
                    defaultChecked={fields?.rating.value === "very-dissatisfied"}
                  />
                </div>
              </fieldset>
            </div>

            <TextAreaWithCharCount
              value={fields?.feedback.value}
              id="feedback"
              name="feedback"
              label="Tell us how we can improve Bichard7"
              hint="Do not include any personal or case information, for example your name, email address, force or case details"
              charLimit={feedbackCharLimit}
              hasError={hasErrors}
              errorMessage={
                fields?.feedback.isEmpty
                  ? feedbackEmptyErrorMessage
                  : fields?.feedback.isOverCharLimit
                    ? feedbackOverCharLimitErrorMessage
                    : ""
              }
            />
            <Button noDoubleClick>{"Send feedback"}</Button>
          </Form>
        </div>
      </Layout>
    </>
  )
}

export default ShareFeedback
