import { LoadingSpinner, LoadingSpinnerContent, LoadingSpinnerWrapper } from "./Loading.styles"
import React, { FC } from "react"

interface LoadingProps {
  text?: string
}

export const Loading: FC<LoadingProps> = ({ text = "Loading Case Details..." }): React.ReactNode => {
  return (
    <LoadingSpinnerWrapper className="loading-spinner" role="status" aria-live="polite" aria-atomic="true">
      <LoadingSpinner className="loading-spinner__spinner" aria-hidden="true" />
      <LoadingSpinnerContent className="loading-spinner__content">
        <p className="govuk-heading-m">{text}</p>
      </LoadingSpinnerContent>
    </LoadingSpinnerWrapper>
  )
}
