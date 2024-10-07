import ConditionalRender from "components/ConditionalRender"
import FeedbackHeaderLinks from "components/FeedbackHeaderLinks"
import Layout from "components/Layout"
import RadioButton from "components/RadioButton/RadioButton"
import { MAX_FEEDBACK_LENGTH } from "config"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { Button, Fieldset, FormGroup, Heading, HintText, MultiChoice, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useCallback, useEffect, useState } from "react"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { Page, SurveyFeedbackType, SwitchingFeedbackResponse, SwitchingReason } from "types/SurveyFeedback"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import Form from "../components/Form"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"

const SwitchingReasonLabel: Record<SwitchingReason, string> = {
  issue: "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.",
  preference: "I prefer working in the old version, and I dislike working in the new version.",
  other: "Other (please specify)"
}

interface SwitchingFeedbackFormState {
  switchingReason?: SwitchingReason
  pageWithIssue?: Page
  feedback?: string
}

interface Props {
  user: DisplayFullUser
  csrfToken: string
  previousPath: string
  fields?: {
    switchingReason: {
      hasError: boolean
      value?: SwitchingReason | null
    }
    pageWithIssue: {
      hasError: boolean
      value?: Page | null
    }
    feedback: {
      hasError: boolean
      value?: string | null
    }
  }
}

function validateForm(form: SwitchingFeedbackFormState): boolean {
  const isIssueOrPreferenceValid =
    !!form.switchingReason && Object.values(SwitchingReason).includes(form.switchingReason as SwitchingReason)
  const isCaseListOrDetailValid =
    form.switchingReason !== SwitchingReason.issue ||
    (!!form.pageWithIssue && Object.values(Page).includes(form.pageWithIssue as Page))
  const isFeedbackValid = !!form.feedback

  return isIssueOrPreferenceValid && isCaseListOrDetailValid && isFeedbackValid
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, csrfToken, formData } = context as CsrfServerSidePropsContext &
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

      const form = formData as SwitchingFeedbackFormState

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

      if (validateForm(form)) {
        const response: SwitchingFeedbackResponse = {
          ...(form.switchingReason ? { switchingReason: form.switchingReason as SwitchingReason } : {}),
          ...(form.pageWithIssue ? { pageWithIssue: form.pageWithIssue as Page } : {}),
          ...(form.feedback ? { comment: form.feedback } : {})
        }

        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          userId: currentUser.id,
          response
        } as SurveyFeedback)

        if (!isError(result)) {
          return redirectTo(redirectToUrl)
        } else {
          throw result
        }
      } else {
        return {
          props: {
            ...props,
            fields: {
              switchingReason: {
                hasError: !form.switchingReason ? true : false,
                value: form.switchingReason ?? null
              },
              pageWithIssue: {
                hasError: !form.pageWithIssue ? true : false,
                value: form.pageWithIssue ?? null
              },
              feedback: { hasError: !form.feedback ? true : false, value: form.feedback ?? null }
            }
          }
        }
      }
    }

    return { props }
  }
)

const SwitchingFeedbackPage: NextPage<Props> = ({ user, previousPath, fields, csrfToken }: Props) => {
  const [skipUrl, setSkipUrl] = useState<URL | null>(null)
  const router = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  const [formState, setFormState] = useState<SwitchingFeedbackFormState>({
    feedback: fields?.feedback.value ?? undefined,
    switchingReason: fields?.switchingReason.value as SwitchingReason,
    pageWithIssue: fields?.pageWithIssue.value as Page
  })
  const handleFormChange = useCallback(
    <T extends keyof SwitchingFeedbackFormState>(field: T, value: SwitchingFeedbackFormState[T]) => {
      setFormState({
        ...formState,
        [field]: value
      })
    },
    [formState, setFormState]
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.append("isSkipped", "true")
    setSkipUrl(url)
  }, [])

  const getRemainingLength = useCallback(
    () => MAX_FEEDBACK_LENGTH - (formState.feedback?.length || 0),
    [formState.feedback]
  )

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Layout>
        <Head>
          <title>{"Bichard7 | Report an issue using new Bichard"}</title>
          <meta name="description" content="Bichard7 | User switching version feedback" />
        </Head>

        <FeedbackHeaderLinks
          csrfToken={csrfToken}
          backLinkUrl={`${router.basePath}` + previousPath}
          skipLinkUrl={skipUrl?.search}
        />

        <Heading as="h1">{"Share your feedback"}</Heading>

        <Form className="b7-switching-feedback-form" method="POST" action={"#"} csrfToken={csrfToken}>
          <Fieldset>
            <p className="govuk-body">
              {
                "You have selected to revert back to old Bichard. What was the reason for doing so? Can you please select the appropriate option. And outline the problem that occurred below so that we can best understand."
              }
            </p>
          </Fieldset>
          <Fieldset>
            <FormGroup id="switchingReason">
              <Heading as="h3" size="SMALL">
                {"Why have you decided to switch version of Bichard?"}
              </Heading>
              <Heading as="h5" size="SMALL">
                {"Select one of the below option."}
              </Heading>
              <MultiChoice
                label={""}
                meta={{
                  error: "Select one of the below options",
                  touched: fields?.switchingReason.hasError
                }}
              >
                <RadioButton
                  name={"switchingReason"}
                  id={`switchingReason-${SwitchingReason.issue}`}
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.issue}
                  value={SwitchingReason.issue}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.issue)}
                  label={SwitchingReasonLabel[SwitchingReason.issue]}
                />
                <RadioButton
                  name={"switchingReason"}
                  id={`switchingReason-${SwitchingReason.preference}`}
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.preference}
                  value={SwitchingReason.preference}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.preference)}
                  label={SwitchingReasonLabel[SwitchingReason.preference]}
                />
                <RadioButton
                  name={"switchingReason"}
                  id={`switchingReason-${SwitchingReason.other}`}
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.other}
                  value={SwitchingReason.other}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.other)}
                  label={SwitchingReasonLabel[SwitchingReason.other]}
                />
              </MultiChoice>
            </FormGroup>
            <ConditionalRender isRendered={formState.switchingReason === SwitchingReason.issue}>
              <FormGroup id="pageWithIssue">
                <Heading as="h3" size="SMALL">
                  {"Which page were you finding an issue with?"}
                </Heading>
                <Heading as="h5" size="SMALL">
                  {"Select one of the below option."}
                </Heading>
                <MultiChoice
                  label={""}
                  meta={{
                    error: "Select one of the below options",
                    touched: fields?.pageWithIssue.hasError
                  }}
                >
                  <RadioButton
                    name={"pageWithIssue"}
                    id={"pageWithIssue-case-list"}
                    defaultChecked={fields?.pageWithIssue.value === Page.caseList}
                    value={Page.caseList}
                    label={"Case list page"}
                    onChange={() => handleFormChange("pageWithIssue", Page.caseList)}
                  />
                  <RadioButton
                    name={"pageWithIssue"}
                    id={"pageWithIssue-case-detail"}
                    defaultChecked={fields?.pageWithIssue.value === Page.caseDetails}
                    value={Page.caseDetails}
                    onChange={() => handleFormChange("pageWithIssue", Page.caseDetails)}
                    label={"Case details page"}
                  />
                </MultiChoice>
              </FormGroup>
              <FormGroup id="comment">
                <Heading as="h3" size="SMALL">
                  {"Could you explain in detail what problem you have experienced?"}
                </Heading>
                <TextArea
                  input={{
                    name: "feedback",
                    defaultValue: fields?.feedback.value ?? undefined,
                    rows: 5,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
                  hint="Tell us why you have made this selection."
                >
                  {""}
                </TextArea>

                <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
              </FormGroup>
            </ConditionalRender>
            <ConditionalRender isRendered={formState.switchingReason === SwitchingReason.preference}>
              <FormGroup id="versionPreferenceFeedback">
                <Heading as="h3" size="SMALL">
                  {
                    "Could you please explain why you prefer using the old version of Bichard over the new version Bichard?"
                  }
                </Heading>
                <TextArea
                  input={{
                    name: "feedback",
                    defaultValue: fields?.feedback.value ?? undefined,
                    rows: 5,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
                  hint="Tell us why you have made this selection."
                >
                  {""}
                </TextArea>

                <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
              </FormGroup>
            </ConditionalRender>
            <ConditionalRender isRendered={formState.switchingReason === SwitchingReason.other}>
              <FormGroup id="otherReasonFeedback">
                <Heading as="h3" size="SMALL">
                  {"Is there another reason why you are switching version of Bichard?"}
                </Heading>
                <TextArea
                  input={{
                    name: "feedback",
                    defaultValue: fields?.feedback.value ?? undefined,
                    rows: 5,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value)
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
                  hint="Tell us why you have made this selection."
                >
                  {""}
                </TextArea>

                <HintText>{`You have ${getRemainingLength()} characters remaining`}</HintText>
              </FormGroup>
            </ConditionalRender>

            <ConditionalRender isRendered={Boolean(formState.switchingReason)}>
              <FormGroup>
                <Button type="submit">{"Send feedback and continue"}</Button>
              </FormGroup>
            </ConditionalRender>
          </Fieldset>
        </Form>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default SwitchingFeedbackPage
