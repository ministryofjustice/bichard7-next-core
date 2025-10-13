import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Fieldset = ({ children }: Props) => <fieldset className="govuk-fieldset">{children}</fieldset>

export default Fieldset
