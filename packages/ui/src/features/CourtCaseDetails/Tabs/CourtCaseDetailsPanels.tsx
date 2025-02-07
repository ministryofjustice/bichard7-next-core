interface CourtCaseDetailsPanelProps {
  children: React.ReactNode
  heading: string
  visible: boolean
}

export const CourtCaseDetailsPanel = ({ children, heading, visible }: CourtCaseDetailsPanelProps) => {
  return (
    <div hidden={!visible}>
      <h3 className="govuk-heading-s">{heading}</h3>
      {children}
    </div>
  )
}
