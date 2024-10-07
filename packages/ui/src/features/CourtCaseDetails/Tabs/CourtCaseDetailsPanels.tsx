import { Heading } from "govuk-react"
import { ReactNode } from "react"

interface CourtCaseDetailsPanelProps {
  children: ReactNode
  heading: string
  visible: boolean
}

export const CourtCaseDetailsPanel = ({ children, heading, visible }: CourtCaseDetailsPanelProps) => {
  return (
    <div hidden={!visible}>
      <Heading as="h3" size="MEDIUM">
        {heading}
      </Heading>
      {children}
    </div>
  )
}
