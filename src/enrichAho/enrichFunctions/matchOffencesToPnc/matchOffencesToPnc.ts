import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"

const matchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): Map<PncOffence, Offence> => {
  const matches = new Map()
  hoOffences.forEach((hoOffence) => {
    pncOffences.forEach((pncOffence) => {
      if (!matches.get(pncOffence) && offencesMatch(hoOffence, pncOffence, true)) {
        matches.set(pncOffence, hoOffence)
      }
    })
  })
  return matches
}

const matchOffencesToPnc = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const caseElem = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  const hoOffences = caseElem.HearingDefendant.Offence
  const pncOffences = aho.PncQuery?.courtCases?.[0].offences
  if (!pncOffences || !hoOffences) {
    return aho
  }
  const matches = matchOffences(hoOffences, pncOffences)

  for (const [pncOffence, hoOffence] of matches.entries()) {
    hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncOffence.offence.sequenceNumber
      .toString()
      .padStart(3, "0")
    hoOffence.AddedByTheCourt = false
  }
  caseElem.CourtCaseReferenceNumber = aho.PncQuery?.courtCases?.[0].courtCaseReference

  return aho
}

export default matchOffencesToPnc
