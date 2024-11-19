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
import { DisplayFullUser } from "types/display/Users"
import { isError } from "types/Result"
import { Page, SurveyFeedbackType, SwitchingFeedbackResponse, SwitchingReason } from "types/SurveyFeedback"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"

import Form from "../components/Form"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"

const SwitchingReasonLabel: Record<SwitchingReason, string> = {
  issue: "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.",
  other: "Other (please specify)",
  preference: "I prefer working in the old version, and I dislike working in the new version."
}

interface SwitchingFeedbackFormState {
  feedback?: string
  pageWithIssue?: Page
  switchingReason?: SwitchingReason
}

interface Props {
  csrfToken: string
  fields?: {
    feedback: {
      hasError: boolean
      value?: null | string
    }
    pageWithIssue: {
      hasError: boolean
      value?: null | Page
    }
    switchingReason: {
      hasError: boolean
      value?: null | SwitchingReason
    }
  }
  previousPath: string
  user: DisplayFullUser
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
    const { csrfToken, currentUser, formData, query, req } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const {
      isSkipped,
      previousPath,
      redirectTo: redirectToUrl
    } = query as { isSkipped?: string; previousPath: string; redirectTo?: string }

    if (!redirectToUrl) {
      throw new Error("no redirectTo URL")
    }

    const props = {
      csrfToken,
      previousPath,
      user: userToDisplayFullUserDto(currentUser)
    }

    if (isPost(req)) {
      const dataSource = await getDataSource()

      const form = formData as SwitchingFeedbackFormState

      if (isSkipped === "true") {
        const result = await insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          response: { skipped: true } as SwitchingFeedbackResponse,
          userId: currentUser.id
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
          response,
          userId: currentUser.id
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
              feedback: { hasError: !form.feedback ? true : false, value: form.feedback ?? null },
              pageWithIssue: {
                hasError: !form.pageWithIssue ? true : false,
                value: form.pageWithIssue ?? null
              },
              switchingReason: {
                hasError: !form.switchingReason ? true : false,
                value: form.switchingReason ?? null
              }
            }
          }
        }
      }
    }

    return { props }
  }
)

const SwitchingFeedbackPage: NextPage<Props> = ({ csrfToken, fields, previousPath, user }: Props) => {
  const [skipUrl, setSkipUrl] = useState<null | URL>(null)
  const router = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  const [formState, setFormState] = useState<SwitchingFeedbackFormState>({
    feedback: fields?.feedback.value ?? undefined,
    pageWithIssue: fields?.pageWithIssue.value as Page,
    switchingReason: fields?.switchingReason.value as SwitchingReason
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
          <meta content="Bichard7 | User switching version feedback" name="description" />
        </Head>

        <FeedbackHeaderLinks
          backLinkUrl={`${router.basePath}` + previousPath}
          csrfToken={csrfToken}
          skipLinkUrl={skipUrl?.search}
        />

        <Heading as="h1">{"Share your feedback"}</Heading>

        <Form action={"#"} className="b7-switching-feedback-form" csrfToken={csrfToken} method="POST">
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
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.issue}
                  id={`switchingReason-${SwitchingReason.issue}`}
                  label={SwitchingReasonLabel[SwitchingReason.issue]}
                  name={"switchingReason"}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.issue)}
                  value={SwitchingReason.issue}
                />
                <RadioButton
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.preference}
                  id={`switchingReason-${SwitchingReason.preference}`}
                  label={SwitchingReasonLabel[SwitchingReason.preference]}
                  name={"switchingReason"}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.preference)}
                  value={SwitchingReason.preference}
                />
                <RadioButton
                  defaultChecked={fields?.switchingReason.value === SwitchingReason.other}
                  id={`switchingReason-${SwitchingReason.other}`}
                  label={SwitchingReasonLabel[SwitchingReason.other]}
                  name={"switchingReason"}
                  onChange={() => handleFormChange("switchingReason", SwitchingReason.other)}
                  value={SwitchingReason.other}
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
                    defaultChecked={fields?.pageWithIssue.value === Page.caseList}
                    id={"pageWithIssue-case-list"}
                    label={"Case list page"}
                    name={"pageWithIssue"}
                    onChange={() => handleFormChange("pageWithIssue", Page.caseList)}
                    value={Page.caseList}
                  />
                  <RadioButton
                    defaultChecked={fields?.pageWithIssue.value === Page.caseDetails}
                    id={"pageWithIssue-case-detail"}
                    label={"Case details page"}
                    name={"pageWithIssue"}
                    onChange={() => handleFormChange("pageWithIssue", Page.caseDetails)}
                    value={Page.caseDetails}
                  />
                </MultiChoice>
              </FormGroup>
              <FormGroup id="comment">
                <Heading as="h3" size="SMALL">
                  {"Could you explain in detail what problem you have experienced?"}
                </Heading>
                <TextArea
                  hint="Tell us why you have made this selection."
                  input={{
                    defaultValue: fields?.feedback.value ?? undefined,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    name: "feedback",
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value),
                    rows: 5
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
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
                  hint="Tell us why you have made this selection."
                  input={{
                    defaultValue: fields?.feedback.value ?? undefined,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    name: "feedback",
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value),
                    rows: 5
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
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
                  hint="Tell us why you have made this selection."
                  input={{
                    defaultValue: fields?.feedback.value ?? undefined,
                    maxLength: MAX_FEEDBACK_LENGTH,
                    name: "feedback",
                    onChange: (e) => handleFormChange("feedback", e.currentTarget.value),
                    rows: 5
                  }}
                  meta={{
                    error: "Input message into the text box",
                    touched: fields?.feedback.hasError
                  }}
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
