import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Accordion = ({ children }: Props) => (
  <div className="govuk-accordion" data-module="govuk-accordion">
    {children}
  </div>
)

export default Accordion
