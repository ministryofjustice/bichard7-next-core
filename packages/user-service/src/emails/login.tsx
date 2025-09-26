import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import EmailValidationLayout from "./EmailValidationLayout"

interface Props {
  code: string
}

const LoginEmail = ({ code }: Props): JSX.Element => (
  <EmailValidationLayout
    paragraphs={[
      "In order to sign in to Bichard, you need to confirm your email address.",
      "Please enter the code below into the login page in Bichard."
    ]}
    title={"Sign in to Bichard"}
    code={code}
  />
)

const LoginEmailText = ({ code }: Props): string =>
  `Sign in to Bichard

In order to sign in to Bichard, you need to confirm your email address. Please enter the code below into the login page in Bichard.

${code}

If you didn't request this email, you can safely ignore it.
`

export default function generateLoginEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <LoginEmail {...props} />

  return {
    subject: "Sign in to Bichard",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: LoginEmailText(props)
  }
}
