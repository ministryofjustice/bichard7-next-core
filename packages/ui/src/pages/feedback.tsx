import Layout from "components/Layout"
import { NoteTextArea } from "components/NoteTextArea"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { Button, MultiChoice } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { SurveyFeedbackResponse, SurveyFeedbackType } from "types/SurveyFeedback"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import Form from "../components/Form"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"

enum FeedbackExperienceKey {
  verySatisfied,
  satisfied,
  neutral,
  dissatisfied,
  veryDissatisfied
}

const FeedbackExperienceOptions: Record<FeedbackExperienceKey, string> = {
  0: "Very satisfied",
  1: "Satisfied",
  2: "Neither satisfied nor dissatisfied",
  3: "Dissatisfied",
  4: "Very dissatisfied"
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { previousPath } = query as { previousPath: string }

    const dataSource = await getDataSource()

    const props = {
      csrfToken,
      user: userToDisplayFullUserDto(currentUser),
      previousPath
    }

    if (isPost(req)) {
      const { isAnonymous, experience, feedback } = formData as {
        isAnonymous: string
        experience: string
        feedback: string
      }

      if (isAnonymous && experience && feedback) {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.General,
          userId: isAnonymous === "no" ? currentUser.id : null,
          response: {
            isAnonymous,
            experience: +experience,
            comment: feedback
          } as SurveyFeedbackResponse
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(previousPath)
        } else {
          throw result
        }
      }

      return {
        props: {
          ...props,
          fields: {
            isAnonymous: { hasError: !isAnonymous ? true : false, value: isAnonymous ?? null },
            experience: { hasError: !experience ? true : false, value: experience ?? null },
            feedback: { hasError: !feedback ? true : false, value: feedback }
          }
        }
      }
    }

    return { props }
  }
)

interface Props {
  csrfToken: string
  user: DisplayFullUser
  previousPath: string
  fields?: {
    isAnonymous: {
      hasError: boolean
      value: string
    }
    experience: {
      hasError: boolean
      value: string
    }
    feedback: {
      hasError: boolean
      value: string
    }
  }
}

const FeedbackPage: NextPage<Props> = ({ user, previousPath, fields, csrfToken }: Props) => {
  const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(MAX_FEEDBACK_LENGTH)
  const router = useRouter()

  const handleFeedbackOnChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setRemainingFeedbackLength(MAX_FEEDBACK_LENGTH - event.currentTarget.value.length)
  }

  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <CurrentUserContext.Provider value={currentUserContext}>
        <Layout>
          <Head>
            <title>{"Bichard7 | Report an issue"}</title>
            <meta name="description" content="Bichard7 | User feedback" />
          </Head>
          <a className="govuk-back-link" href={`${router.basePath}` + previousPath} onClick={function noRefCheck() {}}>
            {"Back"}
          </a>
          <h1 className="govuk-heading-l">{"How can we help?"}</h1>
          <h2 className="govuk-heading-m">{"Report an issue"}</h2>
          <p className="govuk-body">
            {"If you are encountering specific technical issues, you should either check our "}
            <a className="govuk-link" href="/help">
              {"Help page"}
            </a>{" "}
            {"or "}
            <a className="govuk-link" href="mailto: moj-bichard7@madetech.com">
              {"contact the Bichard7"}
            </a>
            {" for support to raise a ticket. Any issues raised via this page will not be handled."}
          </p>

          <h2 className="govuk-heading-m">{"Share your feedback"}</h2>

          <Form method="POST" action={"#"} csrfToken={csrfToken}>
            <p className="govuk-body">
              {
                "If you would like to tell us about your experience using the new version of Bichard7, please do so below."
              }
            </p>
            <fieldset className="govuk-fieldset">
              <div className={"govuk-form-group"} id="isAnonymous">
                <MultiChoice
                  label="After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
                  meta={{
                    error: "Select one of the below options",
                    touched: fields?.isAnonymous.hasError
                  }}
                >
                  <RadioButton
                    name={"isAnonymous"}
                    id={"isAnonymous-no"}
                    defaultChecked={fields?.isAnonymous.value === "no"}
                    value={"no"}
                    label={"Yes, I am happy to be contacted about this feedback."}
                  />
                  <RadioButton
                    name={"isAnonymous"}
                    id={"isAnonymous-yes"}
                    defaultChecked={fields?.isAnonymous.value === "yes"}
                    value={"yes"}
                    label={"No, I would like to opt-out, which will mean my feedback will be anonymous."}
                  />
                </MultiChoice>
              </div>

              <div className={"govuk-form-group"} id="experience">
                <h3 className="govuk-heading-s">{"Rate your experience of using the the new version of Bichard"}</h3>
                <MultiChoice
                  label={""}
                  meta={{
                    error: "Select one of the below options",
                    touched: fields?.experience.hasError
                  }}
                >
                  {Object.keys(FeedbackExperienceOptions).map((experienceKey) => (
                    <RadioButton
                      id={experienceKey}
                      defaultChecked={experienceKey === fields?.experience.value}
                      label={FeedbackExperienceOptions[experienceKey as unknown as FeedbackExperienceKey]}
                      key={experienceKey}
                      name={"experience"}
                      value={experienceKey}
                    />
                  ))}
                </MultiChoice>
              </div>

              <NoteTextArea
                handleOnNoteChange={handleFeedbackOnChange}
                noteRemainingLength={remainingFeedbackLength}
                labelText={"Tell us why you gave this rating"}
                labelSize={"govuk-label--s"}
                id={"feedback"}
                defaultValue={fields?.feedback.value}
                showError={fields?.feedback.hasError}
                name={"feedback"}
                maxLength={MAX_FEEDBACK_LENGTH}
                errorMessage={"Input message into the text box"}
              />

              <div className={"govuk-form-group"}>
                <Button type="submit">{"Send feedback and continue"}</Button>
              </div>
            </fieldset>
          </Form>
        </Layout>
      </CurrentUserContext.Provider>
    </>
  )
}

export default FeedbackPage
