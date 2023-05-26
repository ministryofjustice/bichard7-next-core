import type { Case } from "src/types/AnnotatedHearingOutcome"
import offenceIsBreach from "../enrichCourtCases/offenceMatcher/offenceIsBreach"
import type { OffenceMatch } from "./matchOffencesToPnc"

const annotatePncMatch = (offenceMatch: OffenceMatch, caseElem: Case, addCaseRefToOffences: boolean) => {
  // TODO: In the future we should make this a number in the schema but this check is for compatibility
  if (
    Number(offenceMatch.hoOffence.CriminalProsecutionReference.OffenceReasonSequence) !==
    offenceMatch.pncOffence.pncOffence.offence.sequenceNumber
  ) {
    offenceMatch.hoOffence.CriminalProsecutionReference.OffenceReasonSequence =
      offenceMatch.pncOffence.pncOffence.offence.sequenceNumber.toString().padStart(3, "0")
  }
  offenceMatch.hoOffence.Result.forEach((result) => {
    result.PNCAdjudicationExists = !!offenceMatch.pncOffence.pncOffence.adjudication
  })
  if (offenceIsBreach(offenceMatch.hoOffence)) {
    offenceMatch.hoOffence.ActualOffenceStartDate.StartDate = offenceMatch.pncOffence.pncOffence.offence.startDate
    if (offenceMatch.pncOffence.pncOffence.offence.endDate) {
      offenceMatch.hoOffence.ActualOffenceEndDate = { EndDate: offenceMatch.pncOffence.pncOffence.offence.endDate }
    }
  }

  if (addCaseRefToOffences) {
    offenceMatch.hoOffence.CourtCaseReferenceNumber = offenceMatch.pncOffence.caseReference
    caseElem.CourtCaseReferenceNumber = undefined
  } else {
    caseElem.CourtCaseReferenceNumber = offenceMatch.pncOffence.caseReference
    offenceMatch.hoOffence.CourtCaseReferenceNumber = undefined
    offenceMatch.hoOffence.ManualCourtCaseReference = undefined
  }
}

export default annotatePncMatch
