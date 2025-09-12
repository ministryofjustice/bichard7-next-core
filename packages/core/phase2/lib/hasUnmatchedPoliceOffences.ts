import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const hasUnmatchedPoliceOffences = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string): boolean => {
  const policeCourtCaseRef =
    courtCaseReferenceNumber || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  const policeCourtCase = aho.PncQuery?.courtCases?.find(
    (courtCase) => courtCase.courtCaseReference === policeCourtCaseRef
  )
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const hasMatchedPoliceOffences = !!policeCourtCase?.offences.some((policeOffence) =>
    hoOffences.some(
      (hoOffence) =>
        Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence ?? undefined) ===
          policeOffence.offence.sequenceNumber && hoOffence.CourtCaseReferenceNumber === courtCaseReferenceNumber
    )
  )

  return !hasMatchedPoliceOffences
}

export default hasUnmatchedPoliceOffences
