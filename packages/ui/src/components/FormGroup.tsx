import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export interface FormGroupProps extends ComponentProps<"div"> {
  showError?: boolean
}

export const FormGroup = ({ className, children, showError, ...props }: FormGroupProps) => {
  return (
    <div
      {...props}
      className={mergeClassNames("govuk-form-group", showError ? "govuk-form-group--error" : "", className)}
    >
      {children}
    </div>
  )
}
