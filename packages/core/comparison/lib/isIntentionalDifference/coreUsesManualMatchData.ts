import { normaliseCCR } from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/normaliseCCR"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Core normalises CCRs when checking for matching CCRs on the PNC, so it can handle extra leading 0s
// and still match. Bichard does not do this, and so ignores the CCRs and does something different.

const coreUsesManualMatchData = ({ expected, actual, incomingMessage, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    if ("exceptions" in actualMatchingSummary) {
      return false
    }

    const manualCCRs = incomingMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
      (hoOffence) => hoOffence.ManualCourtCaseReference && hoOffence.CourtCaseReferenceNumber
    ).map((hoOffence) => hoOffence.CourtCaseReferenceNumber!)

    const hasManualCCRs = manualCCRs.length > 0

    const pncCCRs = expected.aho.PncQuery?.courtCases?.map((pncCourtCase) => pncCourtCase.courtCaseReference)
    const rawManualCCRsMatch = manualCCRs.every((manualCCR) => pncCCRs?.includes(manualCCR))

    const normalisedPncCCRs = pncCCRs?.map((ccr) => normaliseCCR(ccr))
    const normalisedCCRsMatch = manualCCRs.every((manualCCR) => normalisedPncCCRs?.includes(normaliseCCR(manualCCR)))

    const matchedCCRs = actualMatchingSummary.offences
      .map((offence) => offence.courtCaseReference || actualMatchingSummary.caseReference)
      .map((ccr) => (ccr ? normaliseCCR(ccr) : ""))

    const coreUsesMatchedManualCCRs = manualCCRs.every((manualCCR) => matchedCCRs.includes(manualCCR))

    return hasManualCCRs && !rawManualCCRsMatch && normalisedCCRsMatch && coreUsesMatchedManualCCRs
  })

export default coreUsesManualMatchData
