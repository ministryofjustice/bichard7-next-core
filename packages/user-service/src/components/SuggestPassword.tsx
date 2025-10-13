import config from "lib/config"
import Link from "./Link"
import Paragraph from "./Paragraph"

interface Props {
  suggestedPassword?: string
  suggestedPasswordUrl?: string
}

const SuggestPassword = ({ suggestedPassword, suggestedPasswordUrl }: Props) => {
  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-top-6">{"Password policy requirements"}</h3>
      <Paragraph>{"Your password must meet the following requirements:"}</Paragraph>
      <ul className="govuk-list govuk-list--bullet">
        <li>{`It has at least ${config.passwordMinLength} characters`}</li>
        <li>{"It does not contain your details such as first name, last name, username, and email address"}</li>
        <li>
          {"It is not easy to guess. You should avoid using simple patterns and obvious words such as "}
          <span className="govuk-!-font-weight-bold">{"qwerty"}</span>
          {", "}
          <span className="govuk-!-font-weight-bold">{"football"}</span>
          {", or "}
          <span className="govuk-!-font-weight-bold">{"dragon"}</span>
          {"."}
        </li>
      </ul>
      <h3 className="govuk-heading-m govuk-!-margin-top-6">{"Not sure what password to choose?"}</h3>
      {!suggestedPassword && (
        <Paragraph>
          {"If you need help choosing a password, we can "}
          <Link href={suggestedPasswordUrl ?? ""} data-test="generate-password">
            {"suggest a password"}
          </Link>
          {" for you."}
        </Paragraph>
      )}
      {suggestedPassword && (
        <>
          <Paragraph>{"Here is a password suggestion:"}</Paragraph>
          <div className="govuk-inset-text" data-test="generated-password">
            {suggestedPassword}
          </div>
          <Paragraph>
            {"If you want to use this password, you can type it or copy and paste it into the fields above."}
          </Paragraph>
          <Paragraph>
            {"If you don't want to use this password, we can "}
            <Link href={suggestedPasswordUrl ?? ""} data-test="generate-password">
              {"suggest another password"}
            </Link>
            {"."}
          </Paragraph>
        </>
      )}
    </>
  )
}

export default SuggestPassword
