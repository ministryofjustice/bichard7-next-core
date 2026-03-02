import { LoadingSpinner, LoadingSpinnerContent, LoadingSpinnerWrapper } from "./Loading.styles"
import React, { FC } from "react"

interface LoadingProps {
  text?: string
}

export const Loading: FC<LoadingProps> = ({ text = "Loading Case Details..." }): React.ReactNode => {
  return (
    <LoadingSpinnerWrapper className="loading-spinner">
      <LoadingSpinner className="loading-spinner__spinner" aria-live="polite" role="status" />
      <LoadingSpinnerContent className="loading-spinner__content">
        <h3 className="govuk-heading-m">{text}</h3>
      </LoadingSpinnerContent>
    </LoadingSpinnerWrapper>
  )
}
