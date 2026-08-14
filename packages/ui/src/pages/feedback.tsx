import { Button } from "components/Buttons/Button"
import { FormGroup } from "components/FormGroup"
import Layout from "components/Layout"
import { NoteTextArea } from "components/NoteTextArea"
import RadioButton from "components/Radios/RadioButton"
import { RadioGroups } from "components/Radios/RadioGroup"
import { MAX_FEEDBACK_LENGTH } from "config"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { canUseTriggerAndExceptionQualityAuditing } from "features/flags/canUseTriggerAndExceptionQualityAuditing"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { DisplayFullUser } from "types/display/Users"
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
    const { currentUser, query, csrfToken } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { previousPath } = query as { previousPath: string }

    const props = {
      csrfToken,
      user: userToDisplayFullUserDto(currentUser),
      previousPath,
      canUseTriggerAndExceptionQualityAuditing: canUseTriggerAndExceptionQualityAuditing(currentUser)
    }

    return { props }
  }
)

interface Props {
  csrfToken: string
  user: DisplayFullUser
  previousPath: string
  canUseTriggerAndExceptionQualityAuditing: boolean
}

const FeedbackPage: NextPage<Props> = ({
  user,
  previousPath,
  csrfToken,
  canUseTriggerAndExceptionQualityAuditing
}: Props) => {
  const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(MAX_FEEDBACK_LENGTH)
  const [isAnonymous, setIsAnonymous] = useState<string | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const router = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  const handleFeedbackOnChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    const value = event.currentTarget.value
    setFeedback(value)
    setRemainingFeedbackLength(MAX_FEEDBACK_LENGTH - value.length)
  }

  const emailSubject = "Bichard7 | General feedback"

  const experienceText = experience ? FeedbackExperienceOptions[experience as unknown as FeedbackExperienceKey] : ""

  const emailBody = `Experience: ${experienceText}\nHappy to be contacted: ${isAnonymous === "no" ? "Yes" : "No"}\nFeedback: ${feedback}`

  const emailHref = `mailto:moj-bichard7@madetech.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  const handleSendEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setHasSubmitted(true)

    if (!isAnonymous || !experience || !feedback.trim()) {
      return
    }

    window.location.assign(emailHref)
    window.location.assign(`${router.basePath}${previousPath}`)
  }

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Layout canUseTriggerAndExceptionQualityAuditing={canUseTriggerAndExceptionQualityAuditing}>
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

        <h2 className="govuk-heading-m" id="share-feedback">
          {"Share your feedback"}
        </h2>
        <p className="govuk-body">
          {"If you would like to tell us about your experience using the new version of Bichard7, please do so below."}
        </p>

        <Form method="POST" action={"#"} csrfToken={csrfToken}>
          <RadioGroups
            id="isAnonymous"
            legendText="After submitting, if we have any enquiries we would like to be able to contact you. If you would like your feedback to be anonymous please opt-out below."
            errorMessage="Select one of the below options"
            hasError={hasSubmitted && !isAnonymous}
          >
            <RadioButton
              name={"isAnonymous"}
              id={"isAnonymous-no"}
              checked={isAnonymous === "no"}
              onChange={(e) => setIsAnonymous(e.target.value)}
              value={"no"}
              label={"Yes, I am happy to be contacted about this feedback."}
            />
            <RadioButton
              name={"isAnonymous"}
              id={"isAnonymous-yes"}
              checked={isAnonymous === "yes"}
              onChange={(e) => setIsAnonymous(e.target.value)}
              value={"yes"}
              label={"No, I would like to opt-out, which will mean my feedback will be anonymous"}
            />
          </RadioGroups>

          <RadioGroups
            id="experience"
            legendText="Rate your experience of using the new version of Bichard"
            errorMessage="Select one of the below options"
            hasError={hasSubmitted && !experience}
          >
            {Object.keys(FeedbackExperienceOptions).map((experienceKey) => (
              <RadioButton
                id={experienceKey}
                checked={experienceKey === experience}
                onChange={(e) => setExperience(e.target.value)}
                label={FeedbackExperienceOptions[experienceKey as unknown as FeedbackExperienceKey]}
                key={experienceKey}
                name={"experience"}
                value={experienceKey}
              />
            ))}
          </RadioGroups>

          <NoteTextArea
            handleOnNoteChange={handleFeedbackOnChange}
            noteRemainingLength={remainingFeedbackLength}
            labelText={"Tell us why you gave this rating"}
            labelSize={"s"}
            id={"feedback"}
            name={"feedback"}
            maxLength={MAX_FEEDBACK_LENGTH}
            errorMessage={"Input message into the text box"}
            showError={hasSubmitted && !feedback.trim()}
          />

          <FormGroup>
            <Button type="button" onClick={handleSendEmailClick}>
              {"Send feedback and continue"}
            </Button>
          </FormGroup>
        </Form>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default FeedbackPage
