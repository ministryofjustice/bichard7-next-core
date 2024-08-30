import { Button } from "govuk-react"
import { ReactNode } from "react"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "utils/colours"

type Props = {
  children: ReactNode
  id?: string
  className?: string
  type?: "submit" | "reset" | "button"
  onClick?: () => void
  dataModule?: string
}

const PrimaryButton = ({ id, children, className, type, onClick, dataModule }: Props) => (
  <Button onClick={onClick} id={id} className={className} type={type} data-module={dataModule}>
    {children}
  </Button>
)

const SecondaryButton = ({ id, children, className, type, onClick }: Props) => (
  <Button
    onClick={onClick}
    id={id}
    className={className}
    type={type}
    buttonColour={gdsLightGrey}
    buttonTextColour={textPrimary}
    buttonShadowColour={gdsMidGrey}
  >
    {children}
  </Button>
)

export { PrimaryButton, SecondaryButton }
