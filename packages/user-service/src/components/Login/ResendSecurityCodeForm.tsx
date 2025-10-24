import Form from "components/Form"
import Paragraph from "components/Paragraph"
import Button from "components/Button"

interface ResendSecurityCodeFormProps {
  csrfToken: string
  emailAddress: string | undefined
  stageName: "loginStage" | "resetStage"
  stageValue: "resetSecurityCode"
}

const ResendSecurityCodeForm: React.FC<ResendSecurityCodeFormProps> = ({
  csrfToken,
  emailAddress,
  stageName,
  stageValue
}) => (
  <>
    <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Get a security code"}</h1>
    <Form method="post" csrfToken={csrfToken}>
      <Paragraph>
        {"We will send a code to: "}
        <b>{emailAddress}</b>
      </Paragraph>
      <Paragraph>
        {`Your code can take up to 5 minutes to arrive. Check your spam folder if you don't get an email.`}
      </Paragraph>
      <Paragraph className="govuk-!-padding-bottom-4">{`The code will expire after 30 minutes.`}</Paragraph>
      <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
      <input type="hidden" name={stageName} value={stageValue} />
      <Button id="security-code-button">{"Get security code"}</Button>
    </Form>
  </>
)

export default ResendSecurityCodeForm
