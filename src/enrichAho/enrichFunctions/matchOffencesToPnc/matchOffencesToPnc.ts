import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncOffence } from "src/types/PncQueryResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"

type CourtCaseMatch = {
  courtCaseReference: string
  offenceMatches: Map<PncOffence, Offence>
}

const annotatePncMatch = (courtCaseMatch: CourtCaseMatch, caseElem: Case, addCaseRefToOffences: boolean) => {
  // Update the matched offences in the AHO with the PNC offence data
  for (const [pncOffence, hoOffence] of courtCaseMatch.offenceMatches.entries()) {
    hoOffence.CriminalProsecutionReference.OffenceReasonSequence = pncOffence.offence.sequenceNumber
      .toString()
      .padStart(3, "0")
    hoOffence.AddedByTheCourt = false

    if (addCaseRefToOffences) {
      hoOffence.CourtCaseReferenceNumber = courtCaseMatch.courtCaseReference
    }
  }

  if (!addCaseRefToOffences) {
    caseElem.CourtCaseReferenceNumber = courtCaseMatch.courtCaseReference
  }
}

const annotateOffencesAddedByCourt = (courtCaseMatches: CourtCaseMatch[], hoOffences: Offence[]) => {
  const matchedHoOffences = courtCaseMatches.map((courtCaseMatch) => [...courtCaseMatch.offenceMatches.values()]).flat()

  // Identify offences added by the court
  for (const hoOffence of hoOffences) {
    if (!matchedHoOffences.includes(hoOffence)) {
      hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
      hoOffence.AddedByTheCourt = true
    }
  }
}

const matchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): Map<PncOffence, Offence> => {
  const pncMatches = new Map<PncOffence, Offence>()
  const hoMatches = new Map<Offence, PncOffence>()

  // First, try and do a direct match including sequence numbers
  for (const hoOffence of hoOffences) {
    for (const pncOffence of pncOffences) {
      if (!pncMatches.get(pncOffence) && !hoMatches.get(hoOffence) && offencesMatch(hoOffence, pncOffence, true)) {
        pncMatches.set(pncOffence, hoOffence)
        hoMatches.set(hoOffence, pncOffence)
        break
      }
    }
  }

  // Then try and match ignoring the sequence number
  for (const hoOffence of hoOffences) {
    for (const pncOffence of pncOffences) {
      if (!pncMatches.get(pncOffence) && !hoMatches.get(hoOffence) && offencesMatch(hoOffence, pncOffence, false)) {
        pncMatches.set(pncOffence, hoOffence)
        hoMatches.set(hoOffence, pncOffence)
        break
      }
    }
  }

  return pncMatches
}

const matchesHaveConflict = (courtCaseMatches: CourtCaseMatch[]): boolean => {
  const seen: Map<Offence, true> = new Map()

  for (const courtCaseMatch of courtCaseMatches) {
    for (const hoOffence of courtCaseMatch.offenceMatches.values()) {
      if (seen.get(hoOffence)) {
        return true
      }

      seen.set(hoOffence, true)
    }
  }

  return false
}

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

  if (courtCaseMatches.length === 0) {
    aho.Exceptions.push({ code: ExceptionCode.HO100304, path: errorPaths.case.asn })
    return aho
  }

  if (matchesHaveConflict(courtCaseMatches)) {
    return aho
  }

  const multipleMatches = courtCaseMatches.length > 1
  courtCaseMatches.forEach((courtCaseMatch) => annotatePncMatch(courtCaseMatch, caseElem, multipleMatches))

  annotateOffencesAddedByCourt(courtCaseMatches, hoOffences)

  return aho
}

export default matchOffencesToPnc
