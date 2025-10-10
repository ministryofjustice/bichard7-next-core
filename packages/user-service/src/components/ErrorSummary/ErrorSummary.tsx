import { ReactNode } from "react"

interface Props {
  title?: string
  show?: boolean
  children: ReactNode
}

const ErrorSummary = ({ title, show = true, children }: Props) => {
  if (!show) {
    return <></>
  }

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      data-test="error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {title}
      </h2>
      <div className="govuk-error-summary__body">{children}</div>
    </div>
  )
}

export default ErrorSummary
