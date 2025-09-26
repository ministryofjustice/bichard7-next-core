import ContactLink from "./ContactLink"
import Details from "./Details"
import Link from "./Link"
import Paragraph from "./Paragraph"

interface Props {
  sendAgainUrl: string
}

const NotReceivedEmail = ({ sendAgainUrl }: Props) => {
  return (
    <>
      <Paragraph>
        {
          "You need to use the exact email address for your account in the Bichard system. If you're having problems receiving the email, please "
        }
        <b>{"try using the older PNN version of your email address."}</b>
      </Paragraph>

      <Details summary={"I still have not received the email"}>
        <p>{"The email may take a few minutes to arrive."}</p>
        <p>
          {"Check your spam or junk folder – if it still has not arrived, you can "}
          <Link href={sendAgainUrl}>{"ask for it to be sent again"}</Link>
          {". Make sure you have entered your email address correctly."}
        </p>
        <p>
          {"If you no longer have access to your email address you will need to "}
          <ContactLink>{"contact us"}</ContactLink>
          {"."}
        </p>
      </Details>
    </>
  )
}

export default NotReceivedEmail
