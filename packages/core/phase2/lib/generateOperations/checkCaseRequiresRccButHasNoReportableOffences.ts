import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

const checkCaseRequiresRccButHasNoReportableOffences = (
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber?: string
) => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!courtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

  let caseRequiresRcc = false
  for (const offence of offences) {
    const isDisarrCompatible = disarrCompatibleResultClass(offence)
    if (offence.AddedByTheCourt && isDisarrCompatible) {
      return false
    }

    const offenceRequiresRcc = offence.Result.some((result) => result.PNCDisposalType === 2060)
    if (offenceRequiresRcc && (!offence.AddedByTheCourt || isDisarrCompatible)) {
      caseRequiresRcc = true
    }
  }

  return caseRequiresRcc
}

export default checkCaseRequiresRccButHasNoReportableOffences
