import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export interface SelectProps extends ComponentProps<"select"> {
  showError?: boolean
  placeholder?: string
}

export const Select = ({ placeholder, showError, className, children, ...props }: SelectProps) => {
  const isControlled = "value" in props
  const selectProps = { ...props }

  if (placeholder && !isControlled) {
    selectProps.defaultValue = props.defaultValue ?? ""
  }

  return (
    <select
      {...selectProps}
      className={mergeClassNames("govuk-select", showError ? "govuk-select--error" : "", className)}
    >
      {placeholder ? (
        <option disabled hidden value="">
          {placeholder}
        </option>
      ) : null}
      {children}
    </select>
  )
}
