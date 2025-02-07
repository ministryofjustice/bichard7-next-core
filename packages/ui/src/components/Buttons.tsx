import { useRouter } from "next/router"

interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode
  dataModule?: string
}

interface LinkButtonProps extends ButtonProps {
  href: string
  secondary?: boolean
}

const Button = ({ children, dataModule = "govuk-button", ...buttonProps }: ButtonProps) => {
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

const SecondaryButton = ({ children, ...buttonProps }: ButtonProps) => (
  <Button {...buttonProps} className={`govuk-button--secondary ${buttonProps.className}`}>
    {children}
  </Button>
)

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  secondary = false,
  ...buttonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()

  return (
    <a href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      {secondary ? (
        <SecondaryButton {...buttonProps}>{children}</SecondaryButton>
      ) : (
        <Button {...buttonProps}>{children}</Button>
      )}
    </a>
  )
}

export { Button, LinkButton, SecondaryButton }
