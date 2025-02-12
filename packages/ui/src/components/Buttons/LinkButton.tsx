import { useRouter } from "next/router"
import { Button, ButtonProps } from "./Button"
import { SecondaryButton } from "./SecondaryButton"

export interface LinkButtonProps extends ButtonProps {
  href: string
  secondary?: boolean
}

export const LinkButton: React.FC<LinkButtonProps> = ({
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
