import { LoadingSpinner, LoadingSpinnerContent, LoadingSpinnerWrapper } from "./Loading.styles"

export const Loading = (): React.ReactNode => {
  return (
    <LoadingSpinnerWrapper className="loading-spinner">
      <LoadingSpinner className="loading-spinner__spinner" aria-live="polite" role="status" />
      <LoadingSpinnerContent className="loading-spinner__content">
        <h3 className="govuk-heading-m">{"Loading Case Details..."}</h3>
      </LoadingSpinnerContent>
    </LoadingSpinnerWrapper>
  )
}
