import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Warning = ({ children }: Props) => (
  <div className="govuk-warning-text">
    <span className="govuk-warning-text__icon" aria-hidden="true">
      {"!"}
    </span>
    <strong className="govuk-warning-text__text">
      <span className="govuk-visually-hidden">{"Warning"}</span>
      {children}
    </strong>
  </div>
)

export default Warning
