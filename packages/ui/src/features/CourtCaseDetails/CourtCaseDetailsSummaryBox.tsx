import { useCourtCase } from "context/CourtCaseContext"
import Asn from "services/Asn"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { SummaryBox, SummaryBoxGrid } from "./CourtCaseDetailsSummaryBox.styles"
import CourtCaseDetailsSummaryBoxField from "./CourtCaseDetailsSummaryBoxField"

const CourtCaseDetailsSummaryBox = () => {
  const { courtCase } = useCourtCase()

  const formattedHearingDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString() || ""
  )
  const formattedDobDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate?.toString() ??
      ""
  )
  const pncIdentifier = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier

  const asn = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
    ? Asn.divideAsn(courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber)
    : ""

  return (
    <SummaryBox className={`govuk-body`} aria-label="Court case summary">
      <SummaryBoxGrid>
        <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />

        <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
        <CourtCaseDetailsSummaryBoxField label="PNCID" value={pncIdentifier} />
        <CourtCaseDetailsSummaryBoxField label="DOB" value={formattedDobDate} />
        <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formattedHearingDate} />
        <CourtCaseDetailsSummaryBoxField
          label="Court code (LJA)"
          value={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode.toString()}
        />
        <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtName={true} />
      </SummaryBoxGrid>
    </SummaryBox>
  )
}

export default CourtCaseDetailsSummaryBox
