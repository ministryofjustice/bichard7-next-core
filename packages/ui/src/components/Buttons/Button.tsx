export interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode
  dataModule?: string
}

export const Button = ({ children, dataModule = "govuk-button", ...buttonProps }: ButtonProps) => {
  const classNames = buttonProps.className?.split(" ") ?? []

  if (!classNames.includes("govuk-button")) {
    classNames.push("govuk-button")
  }

  return (
    <button {...buttonProps} className={classNames.join(" ")} data-module={dataModule}>
      {children}
    </button>
  )
}
