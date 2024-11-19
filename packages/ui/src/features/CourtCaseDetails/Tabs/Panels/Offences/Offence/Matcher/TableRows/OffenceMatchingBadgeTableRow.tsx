import Badge, { BadgeColours } from "components/Badge"
import { useCourtCase } from "context/CourtCaseContext"
import { TableRow } from "features/CourtCaseDetails/Tabs/Panels/TableRow"

interface OffenceMatchingBadgeTableRowProps {
  offenceIndex: number
  offenceReasonSequence?: null | string
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
          <Badge className="moj-badge--large" colour={BadgeColours.Purple} isRendered={true} label={badgeLabel} />
        </>
      }
    />
  )
}

export default OffenceMatchingBadgeTableRow
