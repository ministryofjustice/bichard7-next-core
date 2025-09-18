import type { ComponentProps } from "react"
import { mergeClassNames } from "helpers/mergeClassNames"

export const Select = (props: ComponentProps<"select">) => {
  return (
    <select {...props} className={mergeClassNames("govuk-select", props.className)}>
      {props.children}
    </select>
  )
}
