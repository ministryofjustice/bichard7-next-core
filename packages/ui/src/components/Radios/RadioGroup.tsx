import { ReactNode } from "react"

interface RadioGroupsProps extends React.ComponentProps<"div"> {
  children: ReactNode
  legendText: string
  errorMessage?: string
  hasError?: boolean
}

export const RadioGroups = ({ children, legendText, errorMessage, hasError, ...divProps }: RadioGroupsProps) => {
  const classNames = divProps?.className?.split(" ") ?? []

  if (!classNames.includes("govuk-form-group")) {
    classNames.push("govuk-form-group")
  }

  if (hasError) {
    classNames.push("govuk-form-group--error")
  }

  return (
    <div {...divProps} className={classNames.join(" ")}>
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <h3 className="govuk-fieldset__heading">{legendText}</h3>
      </legend>
      {hasError ? (
        <p className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
        </p>
      ) : (
        ""
      )}
      {children}
    </div>
  )
}
