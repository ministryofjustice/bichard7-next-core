import { ReactNode } from "react"

interface Props {
  summary: string
  "data-test"?: string
  children: ReactNode
}

const Details = ({ children, "data-test": dataTest, summary }: Props) => (
  <details className="govuk-details" data-module="govuk-details">
    <summary className="govuk-details__summary" data-test={dataTest}>
      <span className="govuk-details__summary-text">{summary}</span>
    </summary>

    <div className="govuk-details__text">{children}</div>
  </details>
)

export default Details
