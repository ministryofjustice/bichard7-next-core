import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Summary = ({ children }: Props) => <dl className="govuk-summary-list">{children}</dl>

export default Summary
