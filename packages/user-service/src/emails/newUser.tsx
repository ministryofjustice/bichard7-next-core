import ReactDOMServer from "react-dom/server"
import EmailContent from "types/EmailContent"
import User from "types/User"
import EmailLayout from "./EmailLayout"

interface Props {
  url: string
  user: User
}

const NewUserEmail = ({ url, user }: Props): JSX.Element => (
  <EmailLayout
    actionUrl={url}
    buttonLabel={"Create password"}
    paragraphs={[
      `Hi ${user.forenames} ${user.surname},`,
      "In order to finish setting up your Bichard account, you need to verify your email address and create a password. You can do this by clicking the button below."
    ]}
    title={"Finish setting up your Bichard account"}
  />
)

const NewUserEmailText = ({ url, user }: Props): string =>
  `Hi ${user.forenames} ${user.surname},

In order to finish setting up your Bichard account, you must create a password. You can do this by clicking the link below.

${url}
`

export default function generateNewUserEmail(props: Props): EmailContent {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const htmlEmail = <NewUserEmail {...props} />

  return {
    subject: "Finish Bichard account setup",
    html: ReactDOMServer.renderToStaticMarkup(htmlEmail),
    text: NewUserEmailText(props)
  }
}
