import Badge, { BadgeColours } from "components/Badge"
import { useCourtCase } from "context/CourtCaseContext"
import { InfoRow } from "features/CourtCaseDetails/Tabs/Panels/InfoRow"

interface OffenceMatchingBadgeRowProps {
  offenceIndex: number
  offenceReasonSequence?: string | null
}

const OffenceMatchingBadgeRow = ({
  offenceIndex,
  offenceReasonSequence
}: OffenceMatchingBadgeRowProps): React.ReactNode => {
  const { savedAmendments } = useCourtCase()
  const updatedOffence = savedAmendments.offenceReasonSequence?.find((o) => o.offenceIndex === offenceIndex)

  let badgeLabel = "UNMATCHED"
  if (updatedOffence) {
    badgeLabel = updatedOffence.value === 0 ? "ADDED IN COURT" : "MATCHED"
  }

  return (
    <InfoRow
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

export default OffenceMatchingBadgeRow
