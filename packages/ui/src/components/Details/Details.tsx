import { ReactNode, useState } from "react"
import { Details as StyledDetails } from "./Details.styles"

interface Props {
  summary: string
  id: string
  children: ReactNode
}

type ShowOrHide = "Show" | "Hide"

const Details = ({ children, summary, id }: Props) => {
  const [show, setShow] = useState<ShowOrHide>("Show")

  const hasPrefix = /^(show|hide)\b/i.test(summary)

  const summaryText = hasPrefix ? summary.replace(/^\w+/, show) : `${show} ${summary}`

  return (
    <StyledDetails className="govuk-details" id={id} data-module="govuk-details">
      <summary
        className="govuk-details__summary"
        onClick={() => setShow((prev) => (prev === "Show" ? "Hide" : "Show"))}
      >
        <span className="govuk-details__summary-text">{summaryText}</span>
      </summary>

      <div className="govuk-details__text">{children}</div>
    </StyledDetails>
  )
}

export default Details
