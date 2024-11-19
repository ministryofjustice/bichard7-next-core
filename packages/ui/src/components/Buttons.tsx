import { Button } from "govuk-react"
import { ReactNode } from "react"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "utils/colours"

type Props = {
  children: ReactNode
  className?: string
  dataModule?: string
  id?: string
  onClick?: () => void
  type?: "button" | "reset" | "submit"
}

const PrimaryButton = ({ children, className, dataModule, id, onClick, type }: Props) => (
  <Button className={className} data-module={dataModule} id={id} onClick={onClick} type={type}>
    {children}
  </Button>
)

const SecondaryButton = ({ children, className, id, onClick, type }: Props) => (
  <Button
    buttonColour={gdsLightGrey}
    buttonShadowColour={gdsMidGrey}
    buttonTextColour={textPrimary}
    className={className}
    id={id}
    onClick={onClick}
    type={type}
  >
    {children}
  </Button>
)

export { PrimaryButton, SecondaryButton }
