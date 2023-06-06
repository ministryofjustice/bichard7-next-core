import errorPaths from "src/lib/errorPaths"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"
import type { OffenceMatchOptions } from "./generateCandidate"
import generateCandidate from "./generateCandidate"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { pushToArrayInMap } from "./matchOffencesToPnc"

export type Candidate = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
  exact: boolean
  convictionDatesMatch: boolean
}

const normaliseCCR = (ccr: string): string => {
  const splitCCR = ccr.split("/")
  if (splitCCR.length !== 3) {
    return ccr
  }
  splitCCR[2] = splitCCR[2].replace(/^0+/, "")
  return splitCCR.join("/")
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
        return (
          sequence === pncOffence.pncOffence.offence.sequenceNumber &&
          !!courtCase &&
          normaliseCCR(courtCase) === normaliseCCR(pncOffence.caseReference)
        )
      } else {
        return sequence === pncOffence.pncOffence.offence.sequenceNumber
      }
    }
  }
  return true
}

const ho100304 = { code: ExceptionCode.HO100304, path: errorPaths.case.asn }

class OffenceMatcher {
  private candidates = new Map<Offence, Candidate[]>()

  public matches = new Map<Offence, PncOffenceWithCaseRef>()

  public exceptions: Exception[] = []

  constructor(private hoOffences: Offence[], private pncOffences: PncOffenceWithCaseRef[]) {}

  get hasExceptions(): boolean {
    return this.exceptions.length > 0
  }

  get matchedHoOffences(): Offence[] {
    return [...this.matches.keys()]
  }

  get matchedPncOffences(): PncOffenceWithCaseRef[] {
    return [...this.matches.values()]
  }

  get unmatchedCandidates(): Map<Offence, Candidate[]> {
    const candidates = new Map<Offence, Candidate[]>()
    for (const [hoOffence, candidatePncOffences] of this.candidates.entries()) {
      if ([...this.matches.keys()].includes(hoOffence)) {
        continue
      }

      const unmatchedCandidatePncOffences = candidatePncOffences.filter(
        (candidate) => !this.matchedPncOffences.includes(candidate.pncOffence)
      )

      if (unmatchedCandidatePncOffences.length > 0) {
        candidates.set(hoOffence, unmatchedCandidatePncOffences)
      }
    }
    return candidates
  }

  get unmatchedHoOffences(): Offence[] {
    return this.hoOffences.filter((hoOffence) => !this.matchedHoOffences.includes(hoOffence))
  }

  get unmatchedPncOffences(): PncOffenceWithCaseRef[] {
    return this.pncOffences.filter((pncOffence) => !this.matchedPncOffences.includes(pncOffence))
  }

  hasCandidate(candidate: Candidate): boolean {
    return !!this.candidates.get(candidate.hoOffence)?.some((c) => c.pncOffence === candidate.pncOffence)
  }

  findCandidates() {
    for (const hoOffence of this.hoOffences) {
      for (const pncOffence of this.pncOffences) {
        const candidate = generateCandidate(hoOffence, pncOffence)
        if (candidate && !this.hasCandidate(candidate)) {
          pushToArrayInMap(this.candidates, candidate.hoOffence, candidate)
        }
      }
    }
  }

  filterNonFinalCandidates() {
    const filteredCandidates = new Map<Offence, Candidate[]>()

    for (const matchCandidates of this.candidates.values()) {
      const nonFinalCandidates = matchCandidates.filter(
        (candidate) => !offenceHasFinalResult(candidate.pncOffence.pncOffence)
      )

      if (nonFinalCandidates.length > 0) {
        nonFinalCandidates.forEach((c) => pushToArrayInMap(filteredCandidates, c.hoOffence, c))
      } else {
        matchCandidates.forEach((c) => pushToArrayInMap(filteredCandidates, c.hoOffence, c))
      }
    }

    this.candidates = filteredCandidates
  }

  candidatesForHoOffence(hoOffence: Offence, options: OffenceMatchOptions = {}): PncOffenceWithCaseRef[] {
    return (
      this.unmatchedCandidates
        .get(hoOffence)
        ?.filter((c) => !options.exactDateMatch || c.exact === options.exactDateMatch)
        ?.filter((c) => !options.checkConvictionDate || c.convictionDatesMatch === options.checkConvictionDate)
        .map((c) => c.pncOffence) ?? []
    )
  }

  candidatesForPncOffence(pncOffence: PncOffenceWithCaseRef, options: OffenceMatchOptions = {}): Offence[] {
    return [...this.unmatchedCandidates.keys()].filter((hoOffence) =>
      this.unmatchedCandidates
        .get(hoOffence)
        ?.filter((c) => !options.exactDateMatch || c.exact === options.exactDateMatch)
        ?.filter((c) => !options.checkConvictionDate || c.convictionDatesMatch === options.checkConvictionDate)
        .some((candidate) => candidate.pncOffence === pncOffence)
    )
  }

  hasMatchCandidate(hoOffence: Offence, pncOffence: PncOffenceWithCaseRef, exact: boolean): boolean {
    return !!this.candidates.get(hoOffence)?.some((match) => match.pncOffence === pncOffence && (!exact || match.exact))
  }

  hasMatch(candidate: Candidate): boolean {
    return !!this.matches.get(candidate.hoOffence) || Array.from(this.matches.values()).includes(candidate.pncOffence)
  }

  hasNoMatchConflicts(hoOffence: Offence, pncOffence: PncOffenceWithCaseRef, exact?: boolean): boolean {
    const otherMatchingHoOffences = this.candidatesForPncOffence(pncOffence, { exactDateMatch: exact })
    if (!otherMatchingHoOffences) {
      return false
    }

    return otherMatchingHoOffences.every((candidateHoOffence) => {
      const filteredPncMatchCandidates = this.candidatesForHoOffence(candidateHoOffence).filter(
        (candidatePncOffence) => candidatePncOffence !== pncOffence
      )

      const hasExactMatchToPncOffence = this.hasMatchCandidate(candidateHoOffence, pncOffence, true)

      return candidateHoOffence === hoOffence || (!hasExactMatchToPncOffence && filteredPncMatchCandidates?.length >= 1)
    })
  }

  selectMatch(hoOffence: Offence): PncOffenceWithCaseRef | undefined {
    const candidatePncOffences = this.candidatesForHoOffence(hoOffence)
    if (candidatePncOffences.length === 1) {
      const candidatePncOffence = candidatePncOffences[0]
      if (this.candidatesForPncOffence(candidatePncOffence)?.length === 1) {
        return candidatePncOffence
      } else {
        if (this.hasNoMatchConflicts(hoOffence, candidatePncOffence)) {
          return candidatePncOffence
        }
      }
    } else {
      const exactMatches = this.candidatesForHoOffence(hoOffence, { exactDateMatch: true })
      if (exactMatches.length === 1) {
        const candidatePncOffence = exactMatches[0]
        if (this.hasNoMatchConflicts(hoOffence, candidatePncOffence, true)) {
          return candidatePncOffence
        }
      }
    }
    return undefined
  }

  hoOffencesSharePncOffenceMatch = (hoOffence1: Offence, hoOffence2: Offence): boolean => {
    const pncOffences1 = this.candidatesForHoOffence(hoOffence1)
    const pncOffences2 = this.candidatesForHoOffence(hoOffence2)
    return !!pncOffences1?.some((pncOffence1) => !!pncOffences2?.some((pncOffence2) => pncOffence1 === pncOffence2))
  }

  groupOffences(): Candidate[][] {
    const groups: Candidate[][] = []

    for (const [hoOffence, candidates] of this.unmatchedCandidates.entries()) {
      let foundMatch = false
      for (const group of groups) {
        if (this.hoOffencesSharePncOffenceMatch(hoOffence, group[0].hoOffence)) {
          group.push(...candidates)
          foundMatch = true
        }
      }

      if (!foundMatch) {
        groups.push(candidates)
      }
    }

    return groups
  }

  pncOffenceWasAlreadyMatched(pncOffence: PncOffenceWithCaseRef): boolean {
    return this.matchedPncOffences.includes(pncOffence)
  }

  hoOffenceWasAlreadyMatched(hoOffence: Offence): boolean {
    return this.matchedHoOffences.includes(hoOffence)
  }

  checkGroupForConflicts(group: Candidate[]): void | Exception[] {
    const exceptions: Exception[] = []

    const matchingCourtCaseReferences = group.reduce((acc, candidate) => {
      acc.add(candidate.pncOffence.caseReference)
      return acc
    }, new Set<string>())

    const hoOffences = group.reduce((acc, candidate) => acc.add(candidate.hoOffence), new Set<Offence>())
    const pncOffences = group.reduce(
      (acc, candidate) => acc.add(candidate.pncOffence),
      new Set<PncOffenceWithCaseRef>()
    )

    if (
      matchingCourtCaseReferences.size > 1 &&
      (!offencesHaveEqualResults(Array.from(hoOffences)) || pncOffences.size !== hoOffences.size)
    ) {
      for (const hoOffence of hoOffences) {
        exceptions.push({
          code: ExceptionCode.HO100332,
          path: errorPaths.offence(this.hoOffences.indexOf(hoOffence)).reasonSequence
        })
      }
      return exceptions
    } else if (!offencesHaveEqualResults(Array.from(hoOffences))) {
      for (const hoOffence of hoOffences) {
        exceptions.push({
          code: ExceptionCode.HO100310,
          path: errorPaths.offence(this.hoOffences.indexOf(hoOffence)).reasonSequence
        })
      }
      return exceptions
    }

    if (hoOffences.size < pncOffences.size) {
      exceptions.push(ho100304)
      return exceptions
    }
  }

  successfulMatch(): boolean {
    return (
      this.exceptions.length === 0 &&
      (this.matches.size === this.hoOffences.length || this.matches.size === this.pncOffences.length)
    )
  }

  matchManualSequenceNumbers() {
    for (const [i, hoOffence] of this.hoOffences.entries()) {
      if (hoOffence.ManualSequenceNumber) {
        const candidatePncOffences = this.candidatesForHoOffence(hoOffence)
        const pncOffencesWithMatchingSequence = this.pncOffences.filter((pncOffence) =>
          offenceManuallyMatches(hoOffence, pncOffence)
        )

        if (pncOffencesWithMatchingSequence.length === 0) {
          this.exceptions.push({ code: ExceptionCode.HO100312, path: errorPaths.offence(i).reasonSequence })
          continue
        }

        const matchingPncOffences = candidatePncOffences?.filter((pncOffence) =>
          offenceManuallyMatches(hoOffence, pncOffence)
        )
        if (matchingPncOffences.length === 1) {
          this.matches.set(hoOffence, matchingPncOffences[0])
        } else if (matchingPncOffences.length === 0) {
          this.exceptions.push({ code: ExceptionCode.HO100320, path: errorPaths.offence(i).reasonSequence })
        } else if (matchingPncOffences.length > 1) {
          this.exceptions.push({ code: ExceptionCode.HO100332, path: errorPaths.offence(i).reasonSequence })
        }
      }
    }
  }

  matchOneToOneMatches() {
    let loop = true
    while (loop) {
      let foundMatch = false

      for (const hoOffence of this.unmatchedCandidates.keys()) {
        const selectedMatch = this.selectMatch(hoOffence)
        if (selectedMatch) {
          this.matches.set(hoOffence, selectedMatch)
          foundMatch = true
        }
      }
      loop = foundMatch
    }
  }

  matchGroup(candidates: Candidate[]): void | Exception[] {
    const exceptions = this.checkGroupForConflicts(candidates)
    if (exceptions) {
      return exceptions
    }

    for (const candidate of candidates) {
      if (
        !this.pncOffenceWasAlreadyMatched(candidate.pncOffence) &&
        !this.hoOffenceWasAlreadyMatched(candidate.hoOffence)
      ) {
        this.matches.set(candidate.hoOffence, candidate.pncOffence)
      }
    }
  }

  matchGroups() {
    const groupedCandidates = this.groupOffences()

    for (const group of groupedCandidates) {
      const exactAndConvictionDateMatch = group.filter((c) => c.exact && c.convictionDatesMatch && !this.hasMatch(c))
      this.matchGroup(exactAndConvictionDateMatch)

      const exactMatch = group.filter((c) => c.exact && !this.hasMatch(c))
      this.matchGroup(exactMatch)

      const fuzzyAndConvictionDateMatch = group.filter((c) => c.convictionDatesMatch && !this.hasMatch(c))
      this.matchGroup(fuzzyAndConvictionDateMatch)

      const fuzzyMatch = group.filter((c) => !this.hasMatch(c))
      const exceptions = this.matchGroup(fuzzyMatch)
      if (exceptions) {
        this.exceptions.push(...exceptions)
      }
    }
  }

  match() {
    this.findCandidates()
    this.filterNonFinalCandidates()
    this.matchManualSequenceNumbers()
    if (this.exceptions.length > 0) {
      return
    }
    this.matchOneToOneMatches()
    this.matchGroups()
    if (this.matches.size === 0 && this.exceptions.length === 0) {
      this.exceptions.push(ho100304)
    }
  }
}

export default OffenceMatcher
