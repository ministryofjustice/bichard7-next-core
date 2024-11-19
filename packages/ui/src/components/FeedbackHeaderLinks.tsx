import { BackLink } from "govuk-react"

import { BackLinkWrapper, LinksRow, SkipLink } from "./FeedbackHeaderLinks.styles"
import Form from "./Form"

type Props = {
  backLinkUrl: string
  csrfToken: string
  skipLinkUrl?: string
}
const FeedbackHeaderLinks = ({ backLinkUrl, csrfToken, skipLinkUrl }: Props) => {
  return (
    <LinksRow>
      <BackLinkWrapper>
        <BackLink href={backLinkUrl} onClick={function noRefCheck() {}}>
          {"Back"}
        </BackLink>
      </BackLinkWrapper>
      <Form action={skipLinkUrl} csrfToken={csrfToken} method="POST">
        <SkipLink id="skip-feedback" type="submit">
          {"Skip feedback"}
        </SkipLink>
      </Form>
    </LinksRow>
  )
}

export default FeedbackHeaderLinks
