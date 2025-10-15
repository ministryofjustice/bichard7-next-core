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
          <Link href={sendAgainUrl}>{"send the code again"}</Link>
          {" or you can "}
          <Link href={sendAgainUrl} data-test="not-you-link">
            {"use a different email address."}
          </Link>
        </p>
      </Details>
    </>
  )
}

export default NotReceivedEmail
