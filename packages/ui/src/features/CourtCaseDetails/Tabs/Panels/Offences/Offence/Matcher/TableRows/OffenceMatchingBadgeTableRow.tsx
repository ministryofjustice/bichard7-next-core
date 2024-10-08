import Badge, { BadgeColours } from "components/Badge"
import { useCourtCase } from "context/CourtCaseContext"
import { TableRow } from "features/CourtCaseDetails/Tabs/Panels/TableRow"

interface OffenceMatchingBadgeTableRowProps {
  offenceIndex: number
  offenceReasonSequence?: string | null
}

const OffenceMatchingBadgeTableRow = ({
  offenceIndex,
  offenceReasonSequence
}: OffenceMatchingBadgeTableRowProps): JSX.Element => {
  const { savedAmendments } = useCourtCase()
  const updatedOffence = savedAmendments.offenceReasonSequence?.find((o) => o.offenceIndex === offenceIndex)

  let badgeLabel = "UNMATCHED"
  if (updatedOffence) {
    badgeLabel = updatedOffence.value === 0 ? "ADDED IN COURT" : "MATCHED"
  }

  return (
    <TableRow
      label="Matched PNC offence"
      value={
        <>
          <div>{offenceReasonSequence}</div>
          <Badge isRendered={true} colour={BadgeColours.Purple} label={badgeLabel} className="moj-badge--large" />
        </>
      }
    />
  )
}

export default OffenceMatchingBadgeTableRow
