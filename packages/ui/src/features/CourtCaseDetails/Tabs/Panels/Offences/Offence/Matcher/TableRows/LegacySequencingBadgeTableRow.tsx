import Badge, { BadgeColours } from "components/Badge"
import { TableRow } from "features/CourtCaseDetails/Tabs/Panels/TableRow"

interface LegacySequencingBadgeTableRowProps {
  offenceReasonSequence?: string | null
}

const LegacySequencingBadgeTableRow = ({ offenceReasonSequence }: LegacySequencingBadgeTableRowProps): JSX.Element => {
  return (
    <TableRow
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
