import { Button, ButtonProps } from "./Button"

export const SecondaryButton = ({ children, ...buttonProps }: ButtonProps) => (
  <Button {...buttonProps} className={`govuk-button--secondary ${buttonProps.className}`}>
    {children}
  </Button>
)
