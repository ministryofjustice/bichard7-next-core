import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import User from "types/User"
import EmailLayout from "./EmailLayout"

interface Props {
  user: User
  url: string
}

const PasswordChangedEmail = ({ url, user }: Props): JSX.Element => {
  const { forenames, surname } = user

  return (
    <EmailLayout
      actionUrl={url}
      buttonLabel={"Login"}
      paragraphs={[
        `Hi ${forenames} ${surname},`,
        "Your password has been changed successfully. You can now login to your Bichard account with your new password."
      ]}
      title={"Bichard password changed"}
    />
  )
}

const PasswordResetEmailText = ({ url, user }: Props): string =>
  `Hi ${user.forenames} ${user.surname},

Your password has been changed successfully. You can now login to your Bichard account with your new password.

${url}
`

export default function generatePasswordChangedEmail(props: Props): EmailContent {
  const htmlEmail = <PasswordChangedEmail {...props} />

  return {
    subject: "Bichard password changed",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: PasswordResetEmailText(props)
  }
}
