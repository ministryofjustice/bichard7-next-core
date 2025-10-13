import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FieldsetHint = ({ children }: Props) => <div className="govuk-hint">{children}</div>

export default FieldsetHint
