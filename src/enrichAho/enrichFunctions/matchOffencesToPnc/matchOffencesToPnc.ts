import errorPaths from "src/lib/errorPaths"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCourtCase, PncOffence } from "src/types/PncQueryResult"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import type { OffenceMatchOptions } from "../enrichCourtCases/offenceMatcher/offencesMatch"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"

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

type ExceptionResult = {
  exceptions: Exception[]
}

type ResolvedResult = ExceptionResult | MatchingResult

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

const invertMap = <K, V>(map: Map<K, V[]>): Map<V, K[]> => {
  const reverseLookup = new Map<V, K[]>()
  for (const [key, values] of map.entries()) {
    for (const value of values) {
      pushToArrayInMap(reverseLookup, value, key)
    }
  }
  return reverseLookup
}

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

const offenceManuallyMatches = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const manuallyMatched = hoOffence.ManualSequenceNumber
  if (manuallyMatched) {
    const offenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
    if (offenceReasonSequence !== undefined) {
      const sequence = Number(offenceReasonSequence)
      return !isNaN(sequence) && sequence === pncOffence.offence.sequenceNumber
    }
  }
  return true
}

const findMatchCandidates = (
  hoOffences: Offence[],
  courtCases: PncOffenceWithCaseRef[][],
  options: OffenceMatchOptions = {}
): CandidateOffenceMatches[] => {
  const output = []
  for (const courtCase of courtCases) {
    const matches = new Map<Offence, PncOffenceWithCaseRef[]>()
    // Try and do a direct match including sequence numbers and exact dates
    for (const hoOffence of hoOffences) {
      for (const pncOffence of courtCase) {
        if (!offenceHasFinalResult(pncOffence.pncOffence) && offencesMatch(hoOffence, pncOffence.pncOffence, options)) {
          pushToArrayInMap(matches, hoOffence, pncOffence)
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

const pncOffenceAlreadyMatched = (
  candidates: CandidateOffenceMatches[],
  pncOffence: PncOffenceWithCaseRef
): boolean => {
  for (const candidate of candidates) {
    for (const value of candidate.values()) {
      if (value.some((pncOff) => pncOff === pncOffence)) {
        return true
      }
    }
  }
  return false
}

const addMatchCandidates = (
  candidates: CandidateOffenceMatches[],
  hoOffences: Offence[],
  courtCases: PncOffenceWithCaseRef[][],
  options: OffenceMatchOptions = {}
): CandidateOffenceMatches[] => {
  for (const courtCase of courtCases) {
    const matches = new Map<Offence, PncOffenceWithCaseRef[]>()
    for (const hoOffence of hoOffences) {
      if (hoOffenceAlreadyMatched(candidates, hoOffence)) {
        continue
      }
      for (const pncOffence of courtCase) {
        if (pncOffenceAlreadyMatched(candidates, pncOffence)) {
          continue
        }
        if (offencesMatch(hoOffence, pncOffence.pncOffence, options)) {
          pushToArrayInMap(matches, hoOffence, pncOffence)
        }
      }
    }

    const matchingCandidate = candidates.find((candidate) =>
      [...candidate.values()].some((pncOffences) =>
        pncOffences.some((pncOffence) => pncOffence.courtCaseReference === courtCase[0].courtCaseReference)
      )
    )

    if (matches.size > 0) {
      if (!matchingCandidate) {
        candidates.push(matches)
      } else {
        for (const [hoOffence, pncOffences] of matches.entries()) {
          if (!matchingCandidate.has(hoOffence)) {
            matchingCandidate.set(hoOffence, [])
          }
          for (const pncOffence of pncOffences) {
            const matchedPncOffences = matchingCandidate.get(hoOffence)
            if (!matchedPncOffences!.includes(pncOffence)) {
              matchedPncOffences!.push(pncOffence)
            }
          }
        }
      }
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

const groupSimilarOffences = (hoOffences: Offence[]): Offence[][] => {
  const groups: Offence[][] = []
  for (const hoOffence of hoOffences) {
    let foundMatch = false
    for (const group of groups) {
      if (offencesHaveEqualResults([hoOffence, group[0]])) {
        group.push(hoOffence)
        foundMatch = true
      }
    }

    if (!foundMatch) {
      groups.push([hoOffence])
    }
  }
  return groups
}

const checkForMatchesWithConflictingResults = (
  candidate: CandidateOffenceMatches,
  originalHoOffences: Offence[]
): Exception[] | undefined => {
  const reverseLookup = invertMap(candidate)

  for (const hoOffences of reverseLookup.values()) {
    if (!offencesHaveEqualResults(hoOffences)) {
      const matchingCourtCaseReferences = hoOffences.reduce((acc, hoOffence) => {
        candidate.get(hoOffence)?.forEach((pncOffence) => acc.add(pncOffence.courtCaseReference))
        return acc
      }, new Set<string>())

      const code = matchingCourtCaseReferences.size > 1 ? ExceptionCode.HO100332 : ExceptionCode.HO100310
      return hoOffences.map((hoOffence) => ({
        code,
        path: errorPaths.offence(originalHoOffences.indexOf(hoOffence)).reasonSequence
      }))
    }
  }
}

const filterMatchedCandidates = (
  candidate: CandidateOffenceMatches,
  result: MatchingResult
): CandidateOffenceMatches => {
  const output = new Map<Offence, PncOffenceWithCaseRef[]>()
  for (const [hoOffence, candidatePncOffences] of candidate) {
    const matched = result.matched.some((match) => match.hoOffence === hoOffence)
    const filteredPncOffences = candidatePncOffences.filter(
      (pncOffence) => !result.matched.some((match) => match.pncOffence === pncOffence)
    )
    if (!matched && filteredPncOffences.length > 0) {
      output.set(hoOffence, filteredPncOffences)
    }
  }
  return output
}

const resolveMatch = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidate: CandidateOffenceMatches
): ResolvedResult => {
  const result: MatchingResult = { matched: [], unmatched: [] }
  const exceptions: Exception[] = []
  const multipleMatches = []

  for (const [i, hoOffence] of hoOffences.entries()) {
    if (hoOffence.ManualSequenceNumber) {
      const candidatePncOffences = candidate.get(hoOffence)
      const pncOffencesWithMatchingSequence = pncOffences.some((pncOffence) =>
        offenceManuallyMatches(hoOffence, pncOffence.pncOffence)
      )
      if (!pncOffencesWithMatchingSequence) {
        exceptions.push({ code: ExceptionCode.HO100312, path: errorPaths.offence(i).reasonSequence })
        continue
      }

      const matchingPncOffence = candidatePncOffences?.find((pncOffence) =>
        offenceManuallyMatches(hoOffence, pncOffence.pncOffence)
      )
      if (!matchingPncOffence) {
        exceptions.push({ code: ExceptionCode.HO100320, path: errorPaths.offence(i).reasonSequence })
        continue
      }
      result.matched.push({
        hoOffence,
        pncOffence: matchingPncOffence
      })
    }
  }

  if (exceptions.length > 0) {
    return { exceptions }
  }

  const nonManualCandidates = filterMatchedCandidates(candidate, result)

  exceptions.push(...(checkForMatchesWithConflictingResults(nonManualCandidates, hoOffences) ?? []))
  if (exceptions.length > 0) {
    return { exceptions }
  }

  const reverseLookup = invertMap(nonManualCandidates)

  for (const [hoOffence, candidatePncOffences] of nonManualCandidates.entries()) {
    const unMatched = candidatePncOffences.filter(
      (pncOffence) => !result.matched.some((match) => match.pncOffence === pncOffence)
    )
    if (unMatched.length === 1 && reverseLookup.get(unMatched[0])?.length === 1) {
      result.matched.push({
        hoOffence,
        pncOffence: candidatePncOffences[0]
      })
    } else {
      multipleMatches.push(hoOffence)
    }
  }

  const groupedMatches = groupSimilarOffences(multipleMatches)

  const pncOffenceWasAlreadyMatched = (pncOffence: PncOffenceWithCaseRef): boolean =>
    "matched" in result && result.matched.some((match) => match.pncOffence === pncOffence)

  const hoOffenceWasAlreadyMatched = (hoOffence: Offence): boolean =>
    "matched" in result && result.matched.some((match) => match.hoOffence === hoOffence)

  for (const group of groupedMatches) {
    const matchedPncOffences = candidate.get(group[0])
    if (matchedPncOffences && matchedPncOffences.length <= group.length) {
      for (let i = 0; i < matchedPncOffences.length; i++) {
        if (!pncOffenceWasAlreadyMatched(matchedPncOffences[i])) {
          result.matched.push({
            hoOffence: group[i],
            pncOffence: matchedPncOffences[i]
          })
        }
      }
    } else {
      return { exceptions: [ho100304] }
    }
  }

  for (const hoOffence of hoOffences) {
    if (!hoOffenceWasAlreadyMatched(hoOffence)) {
      result.unmatched.push(hoOffence)
    }
  }

  return result
}

const successfulMatch = (
  result: ResolvedResult,
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[]
): boolean =>
  "matched" in result && (result.matched.length === hoOffences.length || result.matched.length === pncOffences.length)

const resolveMatchesInSingleCourtCase = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidates: CandidateOffenceMatches[]
): ResolvedResult => {
  const successfulMatches = candidates
    .map((candidate) => resolveMatch(hoOffences, pncOffences, candidate))
    .filter((match) => successfulMatch(match, hoOffences, pncOffences))
  if (successfulMatches.length === 1) {
    // If we only have one fully matched case then return it
    return successfulMatches[0]
  } else {
    return { matched: [], unmatched: hoOffences }
  }
}

const resolveMatchesInMultipleCourtCases = (
  hoOffences: Offence[],
  pncOffences: PncOffenceWithCaseRef[],
  candidates: CandidateOffenceMatches[]
): ResolvedResult => {
  const combinedCandidates = flattenMapArray(candidates)
  return resolveMatch(hoOffences, pncOffences, combinedCandidates)
}

const performMatching = (hoOffences: Offence[], pncCourtCases: PncCourtCase[]): ResolvedResult => {
  const courtCases: PncOffenceWithCaseRef[][] = pncCourtCases.map((cc) =>
    cc.offences.map((o) => ({ pncOffence: o, courtCaseReference: cc.courtCaseReference }))
  )
  const exactMatchCandidates = findMatchCandidates(hoOffences, courtCases, {
    checkSequenceNumbers: true,
    exactDateMatch: true
  })

  const pncOffences: PncOffenceWithCaseRef[] = courtCases.flat()

  let matches = resolveMatchesInSingleCourtCase(hoOffences, pncOffences, exactMatchCandidates)
  if (successfulMatch(matches, hoOffences, pncOffences)) {
    // Either all HO offences or all PNC offences are exactly matched
    return matches
  }

  matches = resolveMatchesInMultipleCourtCases(hoOffences, pncOffences, exactMatchCandidates)
  if (successfulMatch(matches, hoOffences, pncOffences)) {
    // Either all HO offences or all PNC offences are exactly matched
    return matches
  }

  // At this point, if we haven't already returned then we need to stop trusting the sequence numbers and re-match
  const matchCandidatesIgnoringSequenceNumber = findMatchCandidates(hoOffences, courtCases, {
    checkSequenceNumbers: false,
    exactDateMatch: true
  })
  matches = resolveMatchesInSingleCourtCase(hoOffences, pncOffences, matchCandidatesIgnoringSequenceNumber)
  if (successfulMatch(matches, hoOffences, pncOffences)) {
    // Either all HO offences or all PNC offences are exactly matched
    return matches
  }

  matches = resolveMatchesInMultipleCourtCases(hoOffences, pncOffences, matchCandidatesIgnoringSequenceNumber)
  if (successfulMatch(matches, hoOffences, pncOffences)) {
    // Either all HO offences or all PNC offences are exactly matched
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
  matches = resolveMatchesInSingleCourtCase(hoOffences, pncOffences, matchCandidatesWithFuzzyDates)
  if ("exceptions" in matches) {
    // Errors were found in the matching
    return matches
  } else if (successfulMatch(matches, hoOffences, pncOffences)) {
    // Either all HO offences or all PNC offences are exactly matched
    return matches
  }

  matches = resolveMatchesInMultipleCourtCases(hoOffences, pncOffences, matchCandidatesWithFuzzyDates)
  if ("matched" in matches && matches.matched.length === 0) {
    return { exceptions: [ho100304] }
  }

  return matches
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

  // If there are still any unmatched PNC offences that don't already have final results in the court cases we have matched, raise an exception
  const matchedCourtCases = matches.matched.reduce((acc, match) => {
    acc.add(match.pncOffence.courtCaseReference)
    return acc
  }, new Set<string>())

  const unmatchedNonFinalPncOffences = courtCases
    .filter((courtCase) => matchedCourtCases.has(courtCase.courtCaseReference))
    .map((courtCase) => courtCase.offences.filter((pncOffence) => !offenceHasFinalResult(pncOffence)))
    .flat()
    .filter((pncOffence) => unmatchedPncOffences.includes(pncOffence))

  if (unmatchedNonFinalPncOffences.length > 0) {
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
