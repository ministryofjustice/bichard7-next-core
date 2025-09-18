import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export interface SelectProps extends ComponentProps<"select"> {
  placeholder?: string
}

export const Select = ({ placeholder, className, children, ...props }: SelectProps) => {
  return (
    <select {...props} className={mergeClassNames("govuk-select", className)}>
      {placeholder ? (
        <option disabled hidden value="">
          {placeholder}
        </option>
      ) : null}
      {children}
    </select>
  )
}
