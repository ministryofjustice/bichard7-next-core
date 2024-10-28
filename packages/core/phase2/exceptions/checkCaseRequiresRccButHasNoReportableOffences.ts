import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../lib/isRecordableOffence"
import isResultCompatibleWithDisposal from "../lib/generateOperations/isResultCompatibleWithDisposal"

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
    const isCompatibleWithDisposal = isResultCompatibleWithDisposal(offence)
    if (offence.AddedByTheCourt && isCompatibleWithDisposal) {
      return false
    }

    const offenceRequiresRcc = offence.Result.some((result) => result.PNCDisposalType === 2060)
    if (offenceRequiresRcc && (!offence.AddedByTheCourt || isCompatibleWithDisposal)) {
      caseRequiresRcc = true
    }
  }

  return caseRequiresRcc
}

export default checkCaseRequiresRccButHasNoReportableOffences
