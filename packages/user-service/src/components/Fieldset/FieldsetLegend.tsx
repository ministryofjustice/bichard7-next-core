import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FieldsetLegend = ({ children }: Props) => (
  <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
    <h1 className="govuk-fieldset__heading">{children}</h1>
  </legend>
)

export default FieldsetLegend
