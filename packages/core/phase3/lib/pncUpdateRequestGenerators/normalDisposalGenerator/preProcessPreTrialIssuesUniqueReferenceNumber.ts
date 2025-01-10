import type { Offence } from "../../../../types/AnnotatedHearingOutcome"

import checkRccSegmentApplicability, {
  RccSegmentApplicability
} from "../../../../phase2/lib/getOperationSequence/generateOperations/checkRccSegmentApplicability"

const preProcessPreTrialIssuesUniqueReferenceNumber = (
  offences: Offence[],
  courtCaseReference?: string,
  ptiurn?: string,
  forceOwner?: null | string
) => {
  if (
    checkRccSegmentApplicability(offences, courtCaseReference) ===
    RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences
  ) {
    const forceCode = (forceOwner?.length === 6 ? forceOwner : ptiurn)?.substring(0, 4) ?? ""
    return [forceCode.padStart(4, " "), "/", ptiurn?.substring(4, 18)].join("")
  }

  return null
}

export default preProcessPreTrialIssuesUniqueReferenceNumber
