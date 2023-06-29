import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import { normaliseCCR } from "src/enrichAho/enrichFunctions/matchOffencesToPnc/OffenceMatcher"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

// Core normalises CCRs when checking for matching CCRs on the PNC, so it can handle extra leading 0s
// and still match. Bichard does not do this, and so ignores the CCRs and does something different.

const coreUsesManualMatchData = (
  _: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual) {
    return false
  }

  const manualCCRs = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (hoOffence) => hoOffence.ManualCourtCaseReference && hoOffence.CourtCaseReferenceNumber
  ).map((hoOffence) => hoOffence.CourtCaseReferenceNumber!)

  const hasManualCCRs = manualCCRs.length > 0

  const pncCCRs = expectedAho.PncQuery?.courtCases?.map((pncCourtCase) => pncCourtCase.courtCaseReference)
  const rawManualCCRsMatch = manualCCRs.every((manualCCR) => pncCCRs?.includes(manualCCR))

  const normalisedPncCCRs = pncCCRs?.map((ccr) => normaliseCCR(ccr))
  const normalisedCCRsMatch = manualCCRs.every((manualCCR) => normalisedPncCCRs?.includes(normaliseCCR(manualCCR)))

  const matchedCCRs = actual.offences
    .map((offence) => offence.courtCaseReference || actual.caseReference)
    .map((ccr) => normaliseCCR(ccr!))

  const coreUsesMatchedManualCCRs = manualCCRs.every((manualCCR) => matchedCCRs.includes(manualCCR))

  return hasManualCCRs && !rawManualCCRsMatch && normalisedCCRsMatch && coreUsesMatchedManualCCRs
}

export default coreUsesManualMatchData
