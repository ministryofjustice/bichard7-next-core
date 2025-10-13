import type { JSX } from "react"
import ReactDOMServer from "react-dom/server"
import type EmailContent from "types/EmailContent"
import type User from "types/User"
import EmailLayout from "./EmailLayout"

interface Props {
  url: string
  user: User
}

const PasswordResetEmail = ({ url, user }: Props): JSX.Element => (
  <EmailLayout
    actionUrl={url}
    buttonLabel={"Reset password"}
    paragraphs={[
      `Hi ${user.forenames} ${user.surname},`,
      "A request has been received to change the password for your Bichard account.",
      "Please confirm this was you by clicking the button below."
    ]}
    title={"Bichard password reset"}
  />
)

const PasswordResetEmailText = ({ url, user }: Props): string =>
  `Hi ${user.forenames} ${user.surname},

A request has been received to change the password for your Bichard account.

Please confirm this was you by click the link below.

${url}
`

export default function generatePasswordResetEmail(props: Props): EmailContent {
  const htmlEmail = <PasswordResetEmail {...props} />

  return {
    subject: "Bichard password reset request",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: PasswordResetEmailText(props)
  }
}
