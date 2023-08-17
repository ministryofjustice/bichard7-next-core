import { normaliseCCR } from "core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/generateCandidate"
import type { AnnotatedHearingOutcome } from "core/phase1/types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Core normalises CCRs when checking for matching CCRs on the PNC, so it can handle extra leading 0s
// and still match. Bichard does not do this, and so ignores the CCRs and does something different.

const coreUsesManualMatchData = (
  _: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome,
  incomingAho: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual) {
    return false
  }

  const manualCCRs = incomingAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (hoOffence) => hoOffence.ManualCourtCaseReference && hoOffence.CourtCaseReferenceNumber
  ).map((hoOffence) => hoOffence.CourtCaseReferenceNumber!)

  const hasManualCCRs = manualCCRs.length > 0

  const pncCCRs = expectedAho.PncQuery?.courtCases?.map((pncCourtCase) => pncCourtCase.courtCaseReference)
  const rawManualCCRsMatch = manualCCRs.every((manualCCR) => pncCCRs?.includes(manualCCR))

  const normalisedPncCCRs = pncCCRs?.map((ccr) => normaliseCCR(ccr))
  const normalisedCCRsMatch = manualCCRs.every((manualCCR) => normalisedPncCCRs?.includes(normaliseCCR(manualCCR)))

  const matchedCCRs = actual.offences
    .map((offence) => offence.courtCaseReference || actual.caseReference)
    .map((ccr) => (ccr ? normaliseCCR(ccr) : ""))

  const coreUsesMatchedManualCCRs = manualCCRs.every((manualCCR) => matchedCCRs.includes(manualCCR))

  return hasManualCCRs && !rawManualCCRsMatch && normalisedCCRsMatch && coreUsesMatchedManualCCRs
}

export default coreUsesManualMatchData
