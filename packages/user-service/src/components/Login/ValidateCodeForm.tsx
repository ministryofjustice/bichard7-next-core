import React from "react"
import Form from "components/Form"
import { RememberForm } from "components/Login/RememberForm"
import Paragraph from "components/Paragraph"
import TextInput from "components/TextInput"
import NotReceivedEmail from "components/NotReceivedEmail"
import Button from "components/Button"

interface ValidateCodeFormProps {
  csrfToken: string
  emailAddress: string | undefined
  validationCode: string | undefined
  invalidCodeError: string | undefined
  stageName: "loginStage" | "resetStage"
  stageValue: "validateCode"
  sendAgainUrl: string
  showRememberForm?: boolean
  RememberFormComponent?: React.FC<{ checked: boolean }>
  buttonText?: string
}

const ValidateCodeForm: React.FC<ValidateCodeFormProps> = ({
  csrfToken,
  emailAddress,
  validationCode,
  invalidCodeError,
  stageName,
  stageValue,
  sendAgainUrl,
  showRememberForm = false,
  buttonText
}) => {
  const textInputWidth = "30"
  const defaultButtonText = stageName === "loginStage" ? "Sign in" : "Next"
  const finalButtonText = buttonText || defaultButtonText

  return (
    <Form method="post" csrfToken={csrfToken}>
      <h1 className="govuk-heading-xl">{"Check your email"}</h1>
      <Paragraph>
        {"We have sent a code to:"} <b>{emailAddress}</b>
      </Paragraph>
      <Paragraph>{`Your code can take up to 5 minutes to arrive. Check your spam folder if you don't get an email.`}</Paragraph>
      <Paragraph className="govuk-!-padding-bottom-4">{`The code will expire after 30 minutes.`}</Paragraph>
      <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
      <input type="hidden" name={stageName} value={stageValue} />
      <TextInput
        id="validationCode"
        name="validationCode"
        label="Security Code"
        labelSize="s"
        hint="Enter the security code"
        type="text"
        width={textInputWidth}
        value={validationCode}
        error={invalidCodeError}
        optionalProps={{ autocomplete: "off", "aria-autocomplete": "none" }}
      />
      {showRememberForm && RememberForm && <RememberForm checked={false} />}
      <Button noDoubleClick>{finalButtonText}</Button>
      <NotReceivedEmail sendAgainUrl={sendAgainUrl} />
    </Form>
  )
}

export default ValidateCodeForm
