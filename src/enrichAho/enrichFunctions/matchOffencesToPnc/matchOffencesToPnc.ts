import errorPaths from "src/lib/errorPaths"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncOffence } from "src/types/PncQueryResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"

type PncOffenceWithCaseRef = {
  courtCaseReference: string
  pncOffence: PncOffence
}

type OffenceMatches = {
  perfectMatches: Map<Offence, PncOffence>
  looseMatches: Map<Offence, PncOffence[]>
}

type CourtCaseMatch = {
  courtCaseReference: string
  offenceMatches: OffenceMatches
}

type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
}

type ResolvedResult =
  | {
      exceptions: Exception[]
    }
  | {
      matched: OffenceMatch[]
      unmatched: Offence[]
    }

const pushToArrayInMap = <K, V>(map: Map<K, V[]>, key: K, ...items: V[]) => {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key)!.push(...items)
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

const perfectlyMatchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): Map<Offence, PncOffence> => {
  const matches = new Map<Offence, PncOffence>()

  // Try and do a direct match including sequence numbers and exact dates
  for (const hoOffence of hoOffences) {
    for (const pncOffence of pncOffences) {
      if (offencesMatch(hoOffence, pncOffence, true, true)) {
        matches.set(hoOffence, pncOffence)
        break
      }
    }
  }
  return matches
}

const looselyMatchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): Map<Offence, PncOffence[]> => {
  const matches = new Map<Offence, PncOffence[]>()
  for (const hoOffence of hoOffences) {
    for (const pncOffence of pncOffences) {
      if (
        offencesMatch(hoOffence, pncOffence, false, true) ||
        offencesMatch(hoOffence, pncOffence, true, false) ||
        offencesMatch(hoOffence, pncOffence, false, false)
      ) {
        pushToArrayInMap(matches, hoOffence, pncOffence)
      }
    }
  }

  return matches
}

const matchOffences = (hoOffences: Offence[], pncOffences: PncOffence[]): OffenceMatches => {
  const perfectMatches = perfectlyMatchOffences(hoOffences, pncOffences)
  const unmatchedHoOffences = hoOffences.filter((hoOffence) => !perfectMatches.has(hoOffence))
  const unmatchedPncOffences = pncOffences.filter((pncOffence) => ![...perfectMatches.values()].includes(pncOffence))
  const looseMatches = looselyMatchOffences(unmatchedHoOffences, unmatchedPncOffences)
  return { perfectMatches, looseMatches }
}

const matchesHaveConflict = (courtCaseMatches: CourtCaseMatch[]): boolean => {
  const seen: Map<Offence, true> = new Map()

  for (const courtCaseMatch of courtCaseMatches) {
    for (const hoOffence of courtCaseMatch.offenceMatches.perfectMatches.keys()) {
      if (seen.has(hoOffence)) {
        return true
      }

      seen.set(hoOffence, true)
    }
  }

  return false
}

const aggregatePerfectMatches = (courtCaseMatches: CourtCaseMatch[]): OffenceMatch[] =>
  courtCaseMatches
    .map((courtCaseMatch) =>
      [...courtCaseMatch.offenceMatches.perfectMatches.entries()].map(([hoOffence, pncOffence]) => ({
        hoOffence,
        pncOffence: { pncOffence, courtCaseReference: courtCaseMatch.courtCaseReference }
      }))
    )
    .flat()

const aggregateLooseMatches = (courtCaseMatches: CourtCaseMatch[]): Map<Offence, PncOffenceWithCaseRef[]> =>
  courtCaseMatches.reduce((acc, courtCaseMatch) => {
    for (const [hoOffence, pncOffences] of courtCaseMatch.offenceMatches.looseMatches.entries()) {
      pushToArrayInMap(
        acc,
        hoOffence,
        ...pncOffences.map((pncOffence) => ({ pncOffence, courtCaseReference: courtCaseMatch.courtCaseReference }))
      )
    }
    return acc
  }, new Map<Offence, PncOffenceWithCaseRef[]>())

const getUnmatchedHoOffences = (hoOffences: Offence[], matches: OffenceMatch[]): Offence[] =>
  hoOffences.filter((hoOffence) => !matches.some((match) => match.hoOffence === hoOffence))

const getUncertainOffences = (
  unmatchedOffences: Offence[],
  looseMatches: Map<Offence, PncOffenceWithCaseRef[]>
): Offence[] => {
  const pncToHoOffenceMatches = new Map<PncOffence, Offence[]>()

  for (const unmatchedOffence of unmatchedOffences) {
    const looselyMatchedOffences = looseMatches.get(unmatchedOffence)
    if (looselyMatchedOffences) {
      looselyMatchedOffences.forEach((pncOffence) => {
        pushToArrayInMap(pncToHoOffenceMatches, pncOffence.pncOffence, unmatchedOffence)
      })
    }
  }

  const uncertainOffences = new Set<Offence>()
  for (const possibleConflictingHoOffences of pncToHoOffenceMatches.values()) {
    if (possibleConflictingHoOffences.length > 1) {
      const uncertainOffencesforPncOffence = possibleConflictingHoOffences.filter((hoOffence) =>
        possibleConflictingHoOffences.some((otherHoOffence) => !offencesHaveEqualResults([hoOffence, otherHoOffence]))
      )
      uncertainOffencesforPncOffence.forEach((hoOffence) => uncertainOffences.add(hoOffence))
    }
  }

  return [...uncertainOffences.values()]
}

const resolveMatches = (hoOffences: Offence[], courtCaseMatches: CourtCaseMatch[]): ResolvedResult => {
  // Identify any conflicts with perfect matches across multiple court cases
  if (matchesHaveConflict(courtCaseMatches)) {
    return { exceptions: [{ code: ExceptionCode.HO100304, path: errorPaths.case.asn }] }
  }

  // Use the perfect matches first
  const matched: OffenceMatch[] = aggregatePerfectMatches(courtCaseMatches)

  // Then choose how to use the loose matches
  let unmatchedOffences = getUnmatchedHoOffences(hoOffences, matched)
  const looseMatches = aggregateLooseMatches(courtCaseMatches)

  // If a loose match only matches one to one, then use it
  for (const unmatchedOffence of unmatchedOffences) {
    const looselyMatchedOffences = looseMatches.get(unmatchedOffence)
    if (looselyMatchedOffences && looselyMatchedOffences.length === 1) {
      matched.push({
        hoOffence: unmatchedOffence,
        pncOffence: looselyMatchedOffences[0]
      })
    }
  }

  // Identify HO100310 exceptions where loose matches are uncertain
  unmatchedOffences = getUnmatchedHoOffences(hoOffences, matched)
  const uncertainOffences = getUncertainOffences(unmatchedOffences, looseMatches)

  if (uncertainOffences.length > 1) {
    const exceptions = uncertainOffences.map((hoOffence) => ({
      code: ExceptionCode.HO100310,
      path: errorPaths.offence(hoOffences.indexOf(hoOffence)).reasonSequence
    }))
    return { exceptions }
  }

  return { matched, unmatched: unmatchedOffences }
}

const hasMatchingOffenceCodes = (hoOffences: Offence[], pncOffences: PncOffence[]): boolean => {
  for (const hoOffence of hoOffences) {
    if (pncOffences.some((offence) => offence.offence.cjsOffenceCode === getOffenceCode(hoOffence))) {
      return true
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
    .filter((match) => match.offenceMatches.perfectMatches.size > 0 || match.offenceMatches.looseMatches.size > 0)

  if (courtCaseMatches.length === 0) {
    aho.Exceptions.push({ code: ExceptionCode.HO100304, path: errorPaths.case.asn })
    return aho
  }

  const matches = resolveMatches(hoOffences, courtCaseMatches)

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
  matches.matched.forEach((match) => annotatePncMatch(match, caseElem, multipleMatches))
  matches.unmatched.forEach((hoOffence) => (hoOffence.AddedByTheCourt = true))

  return aho
}

export default matchOffencesToPnc
