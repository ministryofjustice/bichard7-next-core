import { Button } from "govuk-react"
import { useRouter } from "next/router"
import { ReactNode } from "react"

import { StyledSaveLinkButton } from "./LinkButton.styles"

interface LinkButtonProps extends React.ComponentProps<"button"> {
  buttonColour?: string
  buttonShadowColour?: string
  buttonTextColour?: string
  children: ReactNode
  href: string
}

const LinkButton: React.FC<LinkButtonProps> = ({
  buttonColour,
  buttonShadowColour,
  buttonTextColour,
  children,
  href,
  ...buttonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()

  return (
    <a href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      <Button
        buttonColour={buttonColour}
        buttonShadowColour={buttonShadowColour}
        buttonTextColour={buttonTextColour}
        {...buttonProps}
      >
        {children}
      </Button>
    </a>
  )
}

interface SaveLinkButtonProps extends React.ComponentProps<"button"> {
  buttonText?: string
  className?: string
  disabled?: boolean
  id: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const SaveLinkButton: React.FC<SaveLinkButtonProps> = ({
  buttonText = "Save Correction",
  className,
  disabled,
  id,
  onClick
}: SaveLinkButtonProps) => {
  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onClick(event)
  }

  const saveButtonProps = {
    className,
    disabled,
    id,
    onClick: handleOnClick
  }

  return <StyledSaveLinkButton {...saveButtonProps}>{buttonText}</StyledSaveLinkButton>
}

export { LinkButton, SaveLinkButton }
export default LinkButton
