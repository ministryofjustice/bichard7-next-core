import { FormGroup } from "components/FormGroup"

interface RadioGroupsProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  legendText: string
  errorMessage?: string
  hasError?: boolean
}

export const RadioGroups = ({ children, legendText, errorMessage, hasError, ...divProps }: RadioGroupsProps) => {
  return (
    <FormGroup {...divProps} showError={hasError}>
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{legendText}</legend>
        {hasError ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
          </p>
        ) : (
          ""
        )}
        {children}
      </fieldset>
    </FormGroup>
  )
}
