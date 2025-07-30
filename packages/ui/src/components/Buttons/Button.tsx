import { mergeClassNames } from "../../helpers/mergeClassNames"

export interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode
  dataModule?: string
}

export const Button = ({ children, dataModule = "govuk-button", ...buttonProps }: ButtonProps) => {
  return (
    <button
      {...buttonProps}
      className={mergeClassNames("govuk-button", buttonProps.className)}
      data-module={dataModule}
    >
      {children}
    </button>
  )
}
