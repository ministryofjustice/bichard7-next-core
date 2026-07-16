import { ReactNode } from "react"
import { Details as StyledDetails } from "./Details.styles"

interface Props {
  summary: string
  children: ReactNode
}

const Details = ({ children, summary }: Props) => (
  <StyledDetails className="govuk-details" data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span className="govuk-details__summary-text">{summary}</span>
    </summary>

    <div className="govuk-details__text">{children}</div>
  </StyledDetails>
)

export default Details
