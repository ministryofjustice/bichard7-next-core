import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

const areAllPncResults2007 = (aho: AnnotatedHearingOutcome, courtCaseReference?: string) => {
  const ccr = courtCaseReference || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const matchingPncCase = aho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === ccr)
  const allDisposals = matchingPncCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === 2007)
}

export default areAllPncResults2007
