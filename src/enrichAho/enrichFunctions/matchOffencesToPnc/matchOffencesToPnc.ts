import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"

const matchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): Map<PncOffence, Offence> => {
  const matches = new Map()
  // First, try and do a direct match including sequence numbers
  hoOffences.forEach((hoOffence) => {
    pncOffences.forEach((pncOffence) => {
      if (!matches.get(pncOffence) && offencesMatch(hoOffence, pncOffence, true)) {
        matches.set(pncOffence, hoOffence)
      }
    })
  })

  // Then try and match ignoring the sequence number
  hoOffences.forEach((hoOffence) => {
    pncOffences.forEach((pncOffence) => {
      if (!matches.get(pncOffence) && offencesMatch(hoOffence, pncOffence, false)) {
        matches.set(pncOffence, hoOffence)
      }
    })
  })
  return matches
}

const matchContainsHoOffence = (match: Map<PncOffence, Offence>, hoOffence: Offence): boolean =>
  [...match.values()].includes(hoOffence)

const matchOffencesToPnc = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const caseElem = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  const hoOffences = caseElem.HearingDefendant.Offence
  const courtCases = aho.PncQuery?.courtCases
  if (!courtCases || courtCases.length === 0 || hoOffences.length === 0) {
    return aho
  }

  const courtCaseMatches = courtCases
    .map((courtCase) => ({
      courtCaseReference: courtCase.courtCaseReference,
      offenceMatches: matchOffences(hoOffences, courtCase.offences)
    }))
    .filter((match) => match.offenceMatches.size > 0)

  if (courtCaseMatches.length !== 1) {
    return aho
  }

  // Update the matched offences in the AHO with the PNC offence data
  for (const [pncOffence, hoOffence] of courtCaseMatches[0].offenceMatches.entries()) {
    hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncOffence.offence.sequenceNumber
      .toString()
      .padStart(3, "0")
    hoOffence.AddedByTheCourt = false
  }
  caseElem.CourtCaseReferenceNumber = courtCaseMatches[0].courtCaseReference

  // Identify offences added by the court
  for (const hoOffence of hoOffences) {
    if (!matchContainsHoOffence(courtCaseMatches[0].offenceMatches, hoOffence)) {
      hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
      hoOffence.AddedByTheCourt = true
    }
  }

  return aho
}

export default matchOffencesToPnc
