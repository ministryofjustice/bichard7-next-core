import Badge, { BadgeColours } from "components/Badge"
import { TableRow } from "features/CourtCaseDetails/Tabs/Panels/TableRow"

interface LegacySequencingBadgeTableRowProps {
  offenceReasonSequence?: null | string
}

const LegacySequencingBadgeTableRow = ({ offenceReasonSequence }: LegacySequencingBadgeTableRowProps): JSX.Element => {
  return (
    <TableRow
      label="PNC sequence number"
      value={
        <>
          <div>{offenceReasonSequence}</div>
          <Badge className="moj-badge--large" colour={BadgeColours.Purple} isRendered={true} label="Matched" />
        </>
      }
    />
  )
}

export default LegacySequencingBadgeTableRow
