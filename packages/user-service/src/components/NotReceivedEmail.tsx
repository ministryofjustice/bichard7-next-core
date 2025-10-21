import Details from "./Details"
import Link from "./Link"

interface Props {
  sendAgainUrl: string
}

const NotReceivedEmail = ({ sendAgainUrl }: Props) => {
  return (
    <>
      <Details summary={"Problem with the code?"}>
        <p>
          {"We can "}
          <Link href={`${sendAgainUrl}?notYou=false&action=sendCodeAgain`} data-test="send-code-again-link">
            {"send the code again"}
          </Link>
          {" or you can "}
          <Link href={`${sendAgainUrl}?notYou=true`} data-test="not-you-link">
            {"use a different email address."}
          </Link>
        </p>
        <p>
          {"If you don't know your email address, contact the member of your team responsible for managing Bichard7"}
          {"accounts."}
        </p>
      </Details>
    </>
  )
}

export default NotReceivedEmail
