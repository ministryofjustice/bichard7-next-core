import Badge, { BadgeColours } from "components/Badge"
import { InfoRow } from "features/CourtCaseDetails/Tabs/Panels/InfoRow"

interface LegacySequencingBadgeTableRowProps {
  offenceReasonSequence?: string | null
}

const LegacySequencingBadgeTableRow = ({
  offenceReasonSequence
}: LegacySequencingBadgeTableRowProps): React.ReactNode => {
  return (
    <InfoRow
      label="PNC sequence number"
      value={
        <>
          <div>{offenceReasonSequence}</div>
          <Badge isRendered={true} colour={BadgeColours.Purple} label="Matched" className="moj-badge--large" />
        </>
      }
    />
  )
}

export default LegacySequencingBadgeTableRow
