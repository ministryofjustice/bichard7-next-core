import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export interface LabelProps extends ComponentProps<"label"> {
  size?: "s" | "m" | "l" | "xl"
}

export const Label = ({ className, children, size, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={mergeClassNames("govuk-label", className, size ? `govuk-label--${size}` : "")}
      {...props}
    >
      {children}
    </label>
  )
}
