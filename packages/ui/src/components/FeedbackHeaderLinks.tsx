import { BackLink } from "govuk-react"
import { BackLinkWrapper, LinksRow, SkipLink } from "./FeedbackHeaderLinks.styles"
import Form from "./Form"

type Props = {
  csrfToken: string
  backLinkUrl: string
  skipLinkUrl?: string
  showSkipLink: boolean
}

const FeedbackHeaderLinks = ({ csrfToken, backLinkUrl, skipLinkUrl, showSkipLink = true }: Props) => {
  return (
    <LinksRow>
      <BackLinkWrapper>
        <BackLink href={backLinkUrl} onClick={function noRefCheck() {}}>
          {"Back"}
        </BackLink>
      </BackLinkWrapper>
      {showSkipLink ? (
        <Form method="POST" action={skipLinkUrl} csrfToken={csrfToken}>
          <SkipLink id="skip-feedback" type="submit">
            {"Skip feedback"}
          </SkipLink>
        </Form>
      ) : null}
    </LinksRow>
  )
}

export default FeedbackHeaderLinks
