import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const SuccessBanner = ({ children }: Props) => {
  return (
    <div
      className="govuk-notification-banner govuk-notification-banner--success"
      role="alert"
      aria-labelledby="govuk-notification-banner-title"
      data-module="govuk-notification-banner"
    >
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          {"Success"}
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        <h3 data-test="success-banner_heading" className="govuk-notification-banner__heading">
          {children}
        </h3>
      </div>
    </div>
  )
}

export default SuccessBanner
