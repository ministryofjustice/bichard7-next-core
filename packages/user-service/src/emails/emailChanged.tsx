import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import User from "types/User"
import EmailLayout from "./EmailLayout"

type Status = "old" | "new"

interface Props {
  status: Status
  user: Pick<User, "forenames" | "surname">
}

const statusMessage = (status: Status) =>
  status === "old"
    ? "You will no longer be able to sign in to Bichard with this email address."
    : "You will now need to use this email address to sign in to Bichard."

const EmailChangedEmail = ({ status, user }: Props): JSX.Element => {
  return (
    <EmailLayout
      paragraphs={[
        `Hi, ${user.forenames} ${user.surname}`,
        "The email address associated with your Bichard account has been changed successfully.",
        statusMessage(status)
      ]}
      title={"Bichard password changed"}
    />
  )
}

const EmailChangedText = ({ status, user }: Props): string =>
  `Hi, ${user.forenames} ${user.surname}

The email address associated with your Bichard account has been changed successfully.

${statusMessage(status)}
`

export default function generateEmailChangedEmail(props: Props): EmailContent {
  const htmlEmail = <EmailChangedEmail {...props} />

  return {
    subject: "Bichard password changed",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: EmailChangedText(props)
  }
}
