import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCourtCase, PncOffence } from "src/types/PncQueryResult"
import offenceCategoryIsNonRecordable from "../enrichCourtCases/offenceCategoryIsNonRecordable"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import offenceIsBreach from "../enrichCourtCases/offenceMatcher/offenceIsBreach"
import type { OffenceMatchOptions } from "../enrichCourtCases/offenceMatcher/offencesMatch"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"

const matchingCourtCases = (cases: PncCourtCase[], matches: MatchingResult): PncCourtCase[] =>
  cases.filter((courtCase) => matches.matched.some((match) => courtCase.offences.includes(match.pncOffence.pncOffence)))

const getFirstMatchingCourtCaseWith2060Result = (
  cases: PncCourtCase[],
  matches: MatchingResult
): string | undefined => {
  const matchedCases = matchingCourtCases(cases, matches)
  const matchedCasesWith2060Result = matchedCases.filter((courtCase) =>
    courtCase.offences.some((pncOffence) =>
      matches.matched.some(
        (match) =>
          match.pncOffence.pncOffence === pncOffence &&
          match.hoOffence.Result.some((result) => result.CJSresultCode === 2060)
      )
    )
  )
  return matchedCasesWith2060Result[0]?.courtCaseReference
}

const getFirstMatchingCourtCaseWithoutAdjudications = (
  cases: PncCourtCase[],
  matches: MatchingResult
): string | undefined => {
  const matchedCases = matchingCourtCases(cases, matches)
  const matchedCasesWithNoAdjudications = matchedCases.filter((courtCase) =>
    courtCase.offences.every((pncOffence) => !pncOffence.adjudication)
  )
  return matchedCasesWithNoAdjudications[0]?.courtCaseReference
}

const getFirstMatchingCourtCase = (cases: PncCourtCase[], matches: MatchingResult): string | undefined =>
  matchingCourtCases(cases, matches)[0]?.courtCaseReference

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
  // TODO: In the future we should make this a number in the schema but this check is for compatibility
  if (
    Number(offenceMatch.hoOffence.CriminalProsecutionReference.OffenceReasonSequence) !==
    offenceMatch.pncOffence.pncOffence.offence.sequenceNumber
  ) {
    offenceMatch.hoOffence.CriminalProsecutionReference.OffenceReasonSequence =
      offenceMatch.pncOffence.pncOffence.offence.sequenceNumber.toString().padStart(3, "0")
  }
  offenceMatch.hoOffence.Result.forEach((result) => {
    result.PNCAdjudicationExists = !!offenceMatch.pncOffence.pncOffence.adjudication
  })
  if (offenceIsBreach(offenceMatch.hoOffence)) {
    offenceMatch.hoOffence.ActualOffenceStartDate.StartDate = offenceMatch.pncOffence.pncOffence.offence.startDate
    if (offenceMatch.pncOffence.pncOffence.offence.endDate) {
      offenceMatch.hoOffence.ActualOffenceEndDate = { EndDate: offenceMatch.pncOffence.pncOffence.offence.endDate }
    }
  }

  if (addCaseRefToOffences) {
    offenceMatch.hoOffence.CourtCaseReferenceNumber = offenceMatch.pncOffence.courtCaseReference
    caseElem.CourtCaseReferenceNumber = undefined
  } else {
    caseElem.CourtCaseReferenceNumber = offenceMatch.pncOffence.courtCaseReference
    offenceMatch.hoOffence.CourtCaseReferenceNumber = undefined
  }
}

const offenceManuallyMatches = (hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): boolean => {
  const manualSequence = hoOffence.ManualSequenceNumber
  const manualCourtCase = hoOffence.ManualCourtCaseReference
  if (manualSequence) {
    const offenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
    if (offenceReasonSequence !== undefined) {
      const sequence = Number(offenceReasonSequence)
      if (isNaN(sequence)) {
        return false
      }
      if (manualCourtCase) {
        const courtCase = hoOffence.CourtCaseReferenceNumber
        return sequence === pncOffence.pncOffence.offence.sequenceNumber && courtCase === pncOffence.courtCaseReference
      } else {
        return sequence === pncOffence.pncOffence.offence.sequenceNumber
      }
    }
  }
  return true
}

const findMatchCandidates = (
  hoOffences: Offence[],
  courtCases: PncOffenceWithCaseRef[][],
  options: OffenceMatchOptions = {}
): CandidateOffenceMatches => {
  const matches = new Map<Offence, PncOffenceWithCaseRef[]>()

  for (const courtCase of courtCases) {
    for (const hoOffence of hoOffences) {
      for (const pncOffence of courtCase) {
        if (
          offencesMatch(hoOffence, pncOffence.pncOffence, { ...options, exactDateMatch: true }) ||
          (!options.exactDateMatch && offencesMatch(hoOffence, pncOffence.pncOffence, options))
        ) {
          pushToArrayInMap(matches, hoOffence, pncOffence)
        }
      }
    }
  }

  return matches
}

const hasMatchingOffence = (hoOffences: Offence[], pncOffences: PncOffence[]): boolean => {
  for (const hoOffence of hoOffences) {
    if (pncOffences.some((pncOffence) => offencesMatch(hoOffence, pncOffence))) {
      return true
    }
  }
  return false
}

const hoOffencesSharePncOffenceMatch = (
  hoOffence1: Offence,
  hoOffence2: Offence,
  candidate: CandidateOffenceMatches
): boolean => {
  const pncOffences1 = candidate.get(hoOffence1)
  const pncOffences2 = candidate.get(hoOffence2)
  return !!pncOffences1?.some((pncOffence1) => !!pncOffences2?.some((pncOffence2) => pncOffence1 === pncOffence2))
}

const groupSimilarOffences = (candidate: CandidateOffenceMatches): Offence[][] => {
  const groups: Offence[][] = []
  for (const hoOffence of candidate.keys()) {
    let foundMatch = false
    for (const group of groups) {
      if (
        hoOffencesSharePncOffenceMatch(hoOffence, group[0], candidate) &&
        offencesHaveEqualResults([hoOffence, group[0]])
      ) {
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
    const matchingCourtCaseReferences = hoOffences.reduce((acc, hoOffence) => {
      candidate.get(hoOffence)?.forEach((pncOffence) => acc.add(pncOffence.courtCaseReference))
      return acc
    }, new Set<string>())

    if (matchingCourtCaseReferences.size > 1 && (!offencesHaveEqualResults(hoOffences) || hoOffences.length === 1)) {
      return hoOffences.map((hoOffence) => ({
        code: ExceptionCode.HO100332,
        path: errorPaths.offence(originalHoOffences.indexOf(hoOffence)).reasonSequence
      }))
    } else if (!offencesHaveEqualResults(hoOffences)) {
      return hoOffences.map((hoOffence) => ({
        code: ExceptionCode.HO100310,
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

  for (const [hoOffence, matchedPncOffences] of candidate.entries()) {
    const nonFinalResults = matchedPncOffences.filter((pncOffence) => !offenceHasFinalResult(pncOffence.pncOffence))
    if (nonFinalResults.length > 0) {
      candidate.set(hoOffence, nonFinalResults)
    }
  }

  for (const [i, hoOffence] of hoOffences.entries()) {
    if (hoOffence.ManualSequenceNumber) {
      const candidatePncOffences = candidate.get(hoOffence)
      const pncOffencesWithMatchingSequence = pncOffences.some((pncOffence) =>
        offenceManuallyMatches(hoOffence, pncOffence)
      )
      if (!pncOffencesWithMatchingSequence) {
        exceptions.push({ code: ExceptionCode.HO100312, path: errorPaths.offence(i).reasonSequence })
        continue
      }

      const matchingPncOffence = candidatePncOffences?.find((pncOffence) =>
        offenceManuallyMatches(hoOffence, pncOffence)
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

  const unmatchedCandidates = filterMatchedCandidates(nonManualCandidates, result)
  const groupedMatches = groupSimilarOffences(unmatchedCandidates)

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

const performMatching = (hoOffences: Offence[], pncCourtCases: PncCourtCase[]): ResolvedResult => {
  const courtCases: PncOffenceWithCaseRef[][] = pncCourtCases.map((cc) =>
    cc.offences.map((o) => ({ pncOffence: o, courtCaseReference: cc.courtCaseReference }))
  )

  const pncOffences: PncOffenceWithCaseRef[] = courtCases.flat()

  const candidates = findMatchCandidates(hoOffences, courtCases, { checkSequenceNumbers: false, exactDateMatch: true })

  const exactDateMatches = resolveMatch(hoOffences, pncOffences, candidates)
  if (successfulMatch(exactDateMatches, hoOffences, pncOffences)) {
    return exactDateMatches
  }

  const matchCandidatesWithFuzzyDates = findMatchCandidates(hoOffences, courtCases, {
    checkSequenceNumbers: false,
    exactDateMatch: false
  })

  const fuzzyDateMatches = resolveMatch(hoOffences, pncOffences, matchCandidatesWithFuzzyDates)
  if ("matched" in fuzzyDateMatches && fuzzyDateMatches.matched.length === 0) {
    return { exceptions: [ho100304] }
  }

  return fuzzyDateMatches
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
  if (hasMatchingOffence(matches.unmatched, unmatchedPncOffences)) {
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

  if (matches.matched.length > 0) {
    // Check whether we have matched more than one court case
    const multipleMatches =
      matches.matched.reduce((acc, match) => {
        acc.add(match.pncOffence.courtCaseReference)
        return acc
      }, new Set<string>()).size > 1
    // Annotate the AHO with the matches
    matches.matched.forEach((match) => annotatePncMatch(match, caseElem, multipleMatches))
    matches.unmatched.forEach((hoOffence) => {
      hoOffence.AddedByTheCourt = true

      if (multipleMatches) {
        // TODO: We need to come back and understand the logic for which court case to allocate the new offence to
        if (offenceCategoryIsNonRecordable(hoOffence)) {
          hoOffence.CourtCaseReferenceNumber = courtCases[0].courtCaseReference
        } else {
          hoOffence.CourtCaseReferenceNumber =
            getFirstMatchingCourtCaseWith2060Result(courtCases, matches) ||
            getFirstMatchingCourtCaseWithoutAdjudications(courtCases, matches) ||
            getFirstMatchingCourtCase(courtCases, matches)
        }
      }
      hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
      if (!multipleMatches || !offenceCategoryIsNonRecordable(hoOffence)) {
        // TODO: When we're not trying to maintain compatibility with Bichard, all offences added by the court should have this set to false
        hoOffence.Result.forEach((result) => {
          result.PNCAdjudicationExists = false
        })
      }
    })

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = aho.PncQuery?.pncId
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCCheckname = aho.PncQuery?.checkName
  }

  return aho
}

export default matchOffencesToPnc
