import errorPaths from "src/lib/errorPaths"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCourtCase, PncOffence } from "src/types/PncQueryResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"

const ho100304 = { code: ExceptionCode.HO100304, path: errorPaths.case.asn }

type PncOffenceWithCaseRef = {
  courtCaseReference: string
  pncOffence: PncOffence
}

type CandidateOffenceMatches = Map<Offence, PncOffenceWithCaseRef[]>

type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
}

type MatchingResult = {
  matched: OffenceMatch[]
  unmatched: Offence[]
}

type ResolvedResult =
  | {
      exceptions: Exception[]
    }
  | MatchingResult

const pushToArrayInMap = <K, V>(map: Map<K, V[]>, key: K, ...items: V[]) => {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key)!.push(...items)
}

const flattenMapArray = <K, V>(maps: Map<K, V[]>[]): Map<K, V[]> =>
  maps.reduce((acc, map) => {
    for (const [key, value] of map.entries()) {
      pushToArrayInMap(acc, key, ...value)
    }
    return acc
  }, new Map<K, V[]>())

const annotatePncMatch = (offenceMatch: OffenceMatch, caseElem: Case, addCaseRefToOffences: boolean) => {
  offenceMatch.hoOffence.CriminalProsecutionReference.OffenceReasonSequence =
    offenceMatch.pncOffence.pncOffence.offence.sequenceNumber.toString().padStart(3, "0")
  offenceMatch.hoOffence.AddedByTheCourt = false

  if (addCaseRefToOffences) {
    offenceMatch.hoOffence.CourtCaseReferenceNumber = offenceMatch.pncOffence.courtCaseReference
  } else {
    caseElem.CourtCaseReferenceNumber = offenceMatch.pncOffence.courtCaseReference
  }
}

const findPerfectMatchCandidates = (hoOffences: Offence[], courtCases: PncCourtCase[]): CandidateOffenceMatches[] => {
  const output = []
  for (const courtCase of courtCases) {
    const matches = new Map<Offence, PncOffenceWithCaseRef[]>()
    // Try and do a direct match including sequence numbers and exact dates
    for (const hoOffence of hoOffences) {
      for (const pncOffence of courtCase.offences) {
        if (offencesMatch(hoOffence, pncOffence, true, true)) {
          pushToArrayInMap(matches, hoOffence, { pncOffence, courtCaseReference: courtCase.courtCaseReference })
        }
      }
    }
    if (matches.size > 0) {
      output.push(matches)
    }
  }
  return output
}

const hasMatchingOffenceCodes = (hoOffences: Offence[], pncOffences: PncOffence[]): boolean => {
  for (const hoOffence of hoOffences) {
    if (pncOffences.some((offence) => offence.offence.cjsOffenceCode === getOffenceCode(hoOffence))) {
      return true
    }
  }
  return false
}

const resolvePerfectMatch = (hoOffences: Offence[], candidate: CandidateOffenceMatches): ResolvedResult => {
  const exceptions: Exception[] = []
  const result: MatchingResult = { matched: [], unmatched: [] }
  if (candidate.size === hoOffences.length) {
    for (const [hoOffence, pncOffences] of candidate.entries()) {
      if (pncOffences.length > 1) {
        exceptions.push(ho100304)
      } else {
        result.matched.push({
          hoOffence,
          pncOffence: pncOffences[0]
        })
      }
    }
  } else {
    result.unmatched = hoOffences
  }
  if (exceptions.length > 0) {
    return { exceptions }
  }
  return result
}

const resolvePerfectMatches = (hoOffences: Offence[], candidates: CandidateOffenceMatches[]): ResolvedResult => {
  const perfectCandidates = candidates.filter((candidate) => candidate.size === hoOffences.length)
  if (perfectCandidates.length === 1) {
    return resolvePerfectMatch(hoOffences, perfectCandidates[0])
  } else {
    return { matched: [], unmatched: hoOffences }
  }
}

const resolvePerfectMatchesAcrossCourtCases = (
  hoOffences: Offence[],
  candidates: CandidateOffenceMatches[]
): ResolvedResult => {
  const combinedCandidates = flattenMapArray(candidates)
  return resolvePerfectMatch(hoOffences, combinedCandidates)
}

const performMatching = (hoOffences: Offence[], courtCases: PncCourtCase[]): ResolvedResult => {
  const perfectMatchCandidates = findPerfectMatchCandidates(hoOffences, courtCases)

  let matches = resolvePerfectMatches(hoOffences, perfectMatchCandidates)
  if (("matched" in matches && matches.matched.length === hoOffences.length) || "exceptions" in matches) {
    return matches
  }

  matches = resolvePerfectMatchesAcrossCourtCases(hoOffences, perfectMatchCandidates)
  if (("matched" in matches && matches.matched.length === hoOffences.length) || "exceptions" in matches) {
    return matches
  }

  return { exceptions: [ho100304] }
}

const matchOffencesToPnc = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const caseElem = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  const hoOffences = caseElem.HearingDefendant.Offence
  const courtCases = aho.PncQuery?.courtCases
  if (!courtCases || courtCases.length === 0 || hoOffences.length === 0) {
    return aho
  }

  const matches = performMatching(hoOffences, courtCases)

  if ("exceptions" in matches) {
    aho.Exceptions.push(...matches.exceptions)
    return aho
  }

  // If any unmatched ho offences match the offence code of a pnc offence, then raise a HO100304 because it could be a typo
  const unmatchedPncOffences = courtCases
    .map((courtCase) => courtCase.offences)
    .flat()
    .filter((pncOffence) => !matches.matched.some((match) => match.pncOffence.pncOffence === pncOffence))
  if (hasMatchingOffenceCodes(matches.unmatched, unmatchedPncOffences)) {
    aho.Exceptions.push({ code: ExceptionCode.HO100304, path: errorPaths.case.asn })
    return aho
  }

  // Check whether we have matched more than one court case
  const multipleMatches =
    matches.matched.reduce((acc, match) => {
      acc.add(match.pncOffence.courtCaseReference)
      return acc
    }, new Set<string>()).size > 1
  // Annotate the AHO with the matches
  matches.matched.forEach((match) => annotatePncMatch(match, caseElem, multipleMatches))
  matches.unmatched.forEach((hoOffence) => (hoOffence.AddedByTheCourt = true))

  return aho
}

export default matchOffencesToPnc
