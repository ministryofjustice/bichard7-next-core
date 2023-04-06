import errorPaths from "src/lib/errorPaths"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCourtCase, PncOffence } from "src/types/PncQueryResult"
import type { OffenceMatchOptions } from "../enrichCourtCases/offenceMatcher/offencesMatch"
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

const findMatchCandidates = (
  hoOffences: Offence[],
  courtCases: PncCourtCase[],
  options: OffenceMatchOptions = {}
): CandidateOffenceMatches[] => {
  const output = []
  for (const courtCase of courtCases) {
    const matches = new Map<Offence, PncOffenceWithCaseRef[]>()
    // Try and do a direct match including sequence numbers and exact dates
    for (const hoOffence of hoOffences) {
      for (const pncOffence of courtCase.offences) {
        if (offencesMatch(hoOffence, pncOffence, options)) {
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

const hoOffenceAlreadyMatched = (candidates: CandidateOffenceMatches[], hoOffence: Offence): boolean =>
  candidates.some((candidate) => candidate.has(hoOffence))

const pncOffenceAlreadyMatched = (candidates: CandidateOffenceMatches[], pncOffence: PncOffence): boolean => {
  for (const candidate of candidates) {
    for (const value of candidate.values()) {
      if (value.some((pncOff) => pncOff.pncOffence === pncOffence)) {
        return true
      }
    }
  }
  return false
}

const addMatchCandidates = (
  candidates: CandidateOffenceMatches[],
  hoOffences: Offence[],
  courtCases: PncCourtCase[],
  options: OffenceMatchOptions = {}
): CandidateOffenceMatches[] => {
  for (const courtCase of courtCases) {
    const matches = new Map<Offence, PncOffenceWithCaseRef[]>()
    for (const hoOffence of hoOffences) {
      if (hoOffenceAlreadyMatched(candidates, hoOffence)) {
        continue
      }
      for (const pncOffence of courtCase.offences) {
        if (pncOffenceAlreadyMatched(candidates, pncOffence)) {
          continue
        }
        if (offencesMatch(hoOffence, pncOffence, options)) {
          pushToArrayInMap(matches, hoOffence, { pncOffence, courtCaseReference: courtCase.courtCaseReference })
        }
      }
    }
    if (matches.size > 0) {
      candidates.push(matches)
    }
  }
  return candidates
}

const hasMatchingOffenceCodes = (hoOffences: Offence[], pncOffences: PncOffence[]): boolean => {
  for (const hoOffence of hoOffences) {
    if (pncOffences.some((offence) => offence.offence.cjsOffenceCode === getOffenceCode(hoOffence))) {
      return true
    }
  }
  return false
}

const resolveMatch = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidate: CandidateOffenceMatches
): ResolvedResult => {
  const exceptions: Exception[] = []
  const result: MatchingResult = { matched: [], unmatched: [] }
  if (candidate.size === pncOffences.length || candidate.size === hoOffences.length) {
    for (const [hoOffence, candidatePncOffences] of candidate.entries()) {
      if (candidatePncOffences.length > 1) {
        exceptions.push(ho100304)
      } else {
        result.matched.push({
          hoOffence,
          pncOffence: candidatePncOffences[0]
        })
      }
    }
    for (const hoOffence of hoOffences) {
      if (!candidate.has(hoOffence)) {
        result.unmatched.push(hoOffence)
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

const resolveMatches = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidates: CandidateOffenceMatches[]
): ResolvedResult => {
  const exactCandidates = candidates.filter((candidate) => candidate.size === pncOffences.length)
  if (exactCandidates.length === 1) {
    return resolveMatch(hoOffences, pncOffences, exactCandidates[0])
  } else {
    return { matched: [], unmatched: hoOffences }
  }
}

const resolveMatchesAcrossCourtCases = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidates: CandidateOffenceMatches[]
): ResolvedResult => {
  const combinedCandidates = flattenMapArray(candidates)
  return resolveMatch(hoOffences, pncOffences, combinedCandidates)
}

const performMatching = (hoOffences: Offence[], courtCases: PncCourtCase[]): ResolvedResult => {
  const exactMatchCandidates = findMatchCandidates(hoOffences, courtCases, {
    checkSequenceNumbers: true,
    exactDateMatch: true
  })
  const pncOffences: PncOffenceWithCaseRef[] = courtCases
    .map((cc) => cc.offences.map((o) => ({ pncOffence: o, courtCaseReference: cc.courtCaseReference })))
    .flat()

  let matches = resolveMatches(hoOffences, pncOffences, exactMatchCandidates)
  if ("exceptions" in matches) {
    // Errors were found in the matching
    return matches
  } else if (matches.matched.length === hoOffences.length) {
    // All offences are exactly matched
    return matches
  } else if (matches.matched.length === pncOffences.length) {
    // All PNC offences are matched but some HO offences are added in court
    return matches
  }

  matches = resolveMatchesAcrossCourtCases(hoOffences, pncOffences, exactMatchCandidates)
  if ("exceptions" in matches || matches.matched.length === hoOffences.length) {
    return matches
  }

  // At this point, if we haven't already returned then we need to stop trusting the squence numbers and re-match
  const matchCandidatesIgnoringSequenceNumber = findMatchCandidates(hoOffences, courtCases, {
    checkSequenceNumbers: false,
    exactDateMatch: true
  })
  matches = resolveMatches(hoOffences, pncOffences, matchCandidatesIgnoringSequenceNumber)
  if ("exceptions" in matches) {
    // Errors were found in the matching
    return matches
  } else if (matches.matched.length === hoOffences.length) {
    // All offences are exactly matched
    return matches
  } else if (matches.matched.length === pncOffences.length) {
    // All PNC offences are matched but some HO offences are added in court
    return matches
  }

  matches = resolveMatchesAcrossCourtCases(hoOffences, pncOffences, matchCandidatesIgnoringSequenceNumber)
  if ("exceptions" in matches || matches.matched.length === hoOffences.length) {
    return matches
  }

  // Now we have some unmatched offences which we will try to match by loosening the date matching to see if we can get a full match
  const matchCandidatesWithFuzzyDates = addMatchCandidates(
    matchCandidatesIgnoringSequenceNumber,
    hoOffences,
    courtCases,
    {
      checkSequenceNumbers: false,
      exactDateMatch: false
    }
  )
  matches = resolveMatches(hoOffences, pncOffences, matchCandidatesWithFuzzyDates)
  if ("exceptions" in matches) {
    // Errors were found in the matching
    return matches
  } else if (matches.matched.length === hoOffences.length) {
    // All offences are exactly matched
    return matches
  } else if (matches.matched.length === pncOffences.length) {
    // All PNC offences are matched but some HO offences are added in court
    return matches
  }

  matches = resolveMatchesAcrossCourtCases(hoOffences, pncOffences, matchCandidatesWithFuzzyDates)
  if ("exceptions" in matches || matches.matched.length === hoOffences.length) {
    return matches
  }

  // matches =

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
