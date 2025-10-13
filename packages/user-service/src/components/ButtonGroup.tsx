import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ButtonGroup = ({ children }: Props) => <div className="govuk-button-group">{children}</div>

export default ButtonGroup
