import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export interface SelectProps extends ComponentProps<"select"> {
  showError?: boolean
  placeholder?: string
}

export const Select = ({ placeholder, showError, className, children, ...props }: SelectProps) => {
  return (
    <select {...props} className={mergeClassNames("govuk-select", showError ? "govuk-select--error" : "", className)}>
      {placeholder ? (
        <option disabled hidden value="">
          {placeholder}
        </option>
      ) : null}
      {children}
    </select>
  )
}
