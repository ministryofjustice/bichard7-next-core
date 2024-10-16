import { useCourtCase } from "context/CourtCaseContext"
import { formatDisplayedDate } from "utils/date/formattedDate"
import {
  StyledSummaryBoxFieldInside,
  StyledSummaryBoxFieldOutside,
  SummaryBox,
  SummaryBoxGrid
} from "./CourtCaseDetailsSummaryBox.styles"
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
  const pnci = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier
  const asn = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber

  return (
    <SummaryBox className={`govuk-body`}>
      <SummaryBoxGrid>
        <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />
        <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
        <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
        <CourtCaseDetailsSummaryBoxField label="DOB" value={formattedDobDate} />
        <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formattedHearingDate} />
        <CourtCaseDetailsSummaryBoxField
          label="Court code (LJA)"
          value={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode.toString()}
        />
        <StyledSummaryBoxFieldInside>
          <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtNameClass={"inside"} />
        </StyledSummaryBoxFieldInside>
      </SummaryBoxGrid>
      <StyledSummaryBoxFieldOutside>
        <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtNameClass={"outside"} />
      </StyledSummaryBoxFieldOutside>
    </SummaryBox>
  )
}

export default CourtCaseDetailsSummaryBox
