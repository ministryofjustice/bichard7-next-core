import errorPaths from "src/lib/errorPaths"
import isCcrValid from "src/lib/isCcrValid"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"
import generateCandidate from "./generateCandidate"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { pushToArrayInMap } from "./matchOffencesToPnc"

export type Candidate = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
  exact: boolean
  convictionDatesMatch: boolean
  adjudicationMatch: boolean
}

type CandidateFilterOptions = {
  exactDateMatch?: boolean
  convictionDateMatch?: boolean
  adjudicationMatch?: boolean
}

export const normaliseCCR = (ccr: string): string => {
  const splitCCR = ccr.split("/")
  if (splitCCR.length !== 3) {
    return ccr
  }
  splitCCR[2] = splitCCR[2].replace(/^0+/, "")
  return splitCCR.map((el) => el.toUpperCase()).join("/")
}

const offenceManuallyMatches = (hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): boolean => {
  const manualSequence = !!hoOffence.ManualSequenceNumber
  const manualCourtCase = !!hoOffence.ManualCourtCaseReference
  const offenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
  const sequence = Number(offenceReasonSequence)
  const courtCase = hoOffence.CourtCaseReferenceNumber
  if (manualSequence && isNaN(sequence)) {
    return false
  }
  const sequenceMatches = sequence === pncOffence.pncOffence.offence.sequenceNumber
  const ccrMatches = !!courtCase && normaliseCCR(courtCase) === normaliseCCR(pncOffence.caseReference)

  if (manualSequence && manualCourtCase) {
    return sequenceMatches && ccrMatches
  } else if (manualSequence) {
    return sequenceMatches
  } else if (manualCourtCase) {
    return ccrMatches
  }

  return false
}

const ho100304 = { code: ExceptionCode.HO100304, path: errorPaths.case.asn }

class OffenceMatcher {
  private candidates = new Map<Offence, Candidate[]>()

  public matches = new Map<Offence, PncOffenceWithCaseRef>()

  public exceptions: Exception[] = []

  constructor(private hoOffences: Offence[], private pncOffences: PncOffenceWithCaseRef[], private hearingDate: Date) {}

  get hasExceptions(): boolean {
    return this.exceptions.length > 0
  }

  get matchedHoOffences(): Offence[] {
    return [...this.matches.keys()]
  }

  get matchedPncOffences(): PncOffenceWithCaseRef[] {
    return [...this.matches.values()]
  }

  unmatchedCandidates(options: CandidateFilterOptions = {}): Map<Offence, Candidate[]> {
    const candidates = new Map<Offence, Candidate[]>()
    for (const [hoOffence, candidatePncOffences] of this.candidates.entries()) {
      if ([...this.matches.keys()].includes(hoOffence)) {
        continue
      }

      const unmatchedCandidatePncOffences = candidatePncOffences
        .filter((candidate) => !this.matchedPncOffences.includes(candidate.pncOffence))
        .filter((c) => !options.exactDateMatch || c.exact === options.exactDateMatch)
        .filter((c) => !options.convictionDateMatch || c.convictionDatesMatch === options.convictionDateMatch)
        .filter((c) => !options.adjudicationMatch || c.adjudicationMatch === options.adjudicationMatch)

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

  hasException(exception: Exception): boolean {
    return this.exceptions.some(
      (e) => e.code === exception.code && JSON.stringify(e.path) === JSON.stringify(exception.path)
    )
  }

  addException(exception: Exception): void {
    if (!this.hasException(exception)) {
      this.exceptions.push(exception)
    }
  }

  hasCandidate(candidate: Candidate): boolean {
    return !!this.candidates.get(candidate.hoOffence)?.some((c) => c.pncOffence === candidate.pncOffence)
  }

  findCandidates() {
    for (const hoOffence of this.hoOffences) {
      for (const pncOffence of this.pncOffences) {
        const candidate = generateCandidate(hoOffence, pncOffence, this.hearingDate)
        if (candidate && !this.hasCandidate(candidate)) {
          pushToArrayInMap(this.candidates, candidate.hoOffence, candidate)
        }
      }
    }
  }

  candidatesForHoOffence(hoOffence: Offence, options: CandidateFilterOptions = {}): PncOffenceWithCaseRef[] {
    return (
      this.unmatchedCandidates(options)
        .get(hoOffence)
        ?.map((c) => c.pncOffence) ?? []
    )
  }

  candidatesForPncOffence(pncOffence: PncOffenceWithCaseRef, options: CandidateFilterOptions = {}): Offence[] {
    return [...this.unmatchedCandidates(options).keys()].filter((hoOffence) =>
      this.unmatchedCandidates(options)
        .get(hoOffence)
        ?.some((candidate) => candidate.pncOffence === pncOffence)
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

  hoOffencesSharePncOffenceMatch = (
    hoOffence1: Offence,
    hoOffence2: Offence,
    options: CandidateFilterOptions
  ): boolean => {
    const pncOffences1 = this.candidatesForHoOffence(hoOffence1, options)
    const pncOffences2 = this.candidatesForHoOffence(hoOffence2, options)
    return !!pncOffences1?.some((pncOffence1) => !!pncOffences2?.some((pncOffence2) => pncOffence1 === pncOffence2))
  }

  groupOffences(options: CandidateFilterOptions = {}): Candidate[][] {
    const groups: Candidate[][] = []

    for (const [hoOffence, candidates] of this.unmatchedCandidates(options).entries()) {
      let foundMatch = false

      for (const group of groups) {
        if (this.hoOffencesSharePncOffenceMatch(hoOffence, group[0].hoOffence, options)) {
          group.push(...candidates)
          foundMatch = true
        }
      }

      if (!foundMatch) {
        if (candidates.length > 0) {
          groups.push(candidates)
        }
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
    let exceptions: Exception[] = []

    for (const convictionDateMatch of [true, false]) {
      exceptions = []
      for (const [i, hoOffence] of this.unmatchedHoOffences.entries()) {
        const hasManualSequence =
          !!hoOffence.ManualSequenceNumber && !!hoOffence.CriminalProsecutionReference.OffenceReasonSequence
        const hasManualCCR =
          !!hoOffence.ManualCourtCaseReference &&
          !!hoOffence.CourtCaseReferenceNumber &&
          isCcrValid(hoOffence.CourtCaseReferenceNumber)
        if (hasManualSequence) {
          const sequence = Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence)
          const pncOffencesWithMatchingSequence = this.pncOffences.filter(
            (pncOffence) => pncOffence.pncOffence.offence.sequenceNumber === sequence
          )

          if (pncOffencesWithMatchingSequence.length === 0) {
            exceptions.push({ code: ExceptionCode.HO100312, path: errorPaths.offence(i).reasonSequence })
            continue
          }
        }

        if (hasManualSequence || hasManualCCR) {
          const candidatePncOffences = this.candidatesForHoOffence(hoOffence, { convictionDateMatch })

          const matchingPncOffences = candidatePncOffences?.filter((pncOffence) =>
            offenceManuallyMatches(hoOffence, pncOffence)
          )
          if (matchingPncOffences.length === 1) {
            this.matches.set(hoOffence, matchingPncOffences[0])
          } else if (matchingPncOffences.length === 0) {
            exceptions.push({ code: ExceptionCode.HO100320, path: errorPaths.offence(i).reasonSequence })
          } else if (matchingPncOffences.length > 1) {
            exceptions.push({ code: ExceptionCode.HO100332, path: errorPaths.offence(i).reasonSequence })
          }
        }
      }
    }

    exceptions.forEach(this.addException, this)
  }

  matchOneToOneMatches() {
    let loop = true
    while (loop) {
      let foundMatch = false

      for (const hoOffence of this.unmatchedCandidates().keys()) {
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
    for (const nonFinal of [true, false]) {
      const filteredCandidates = nonFinal
        ? candidates.filter((c) => !offenceHasFinalResult(c.pncOffence.pncOffence))
        : candidates
      const exceptions = this.checkGroupForConflicts(filteredCandidates)
      if (exceptions) {
        return exceptions
      }

      for (const candidate of filteredCandidates) {
        if (
          !this.pncOffenceWasAlreadyMatched(candidate.pncOffence) &&
          !this.hoOffenceWasAlreadyMatched(candidate.hoOffence)
        ) {
          this.matches.set(candidate.hoOffence, candidate.pncOffence)
        }
      }
    }
  }

  matchGroups() {
    const exactAndAdjudicationGroups = this.groupOffences({ exactDateMatch: true, adjudicationMatch: true })
    exactAndAdjudicationGroups.forEach(this.matchGroup, this)

    const exactMatchGroups = this.groupOffences({ exactDateMatch: true })
    exactMatchGroups.forEach(this.matchGroup, this)

    const fuzzyAndAdjudicationGroups = this.groupOffences({ adjudicationMatch: true })
    fuzzyAndAdjudicationGroups.forEach(this.matchGroup, this)

    const fuzzyGroups = this.groupOffences()
    const exceptions = fuzzyGroups
      .map(this.matchGroup, this)
      .filter((x) => !!x)
      .flat() as Exception[]

    if (exceptions) {
      exceptions.forEach(this.addException, this)
    }
  }

  match() {
    this.findCandidates()
    this.matchManualSequenceNumbers()
    if (this.exceptions.length > 0) {
      return
    }
    this.matchOneToOneMatches()
    this.matchGroups()
    if (this.matches.size === 0 && this.exceptions.length === 0) {
      this.addException(ho100304)
    }
  }
}

export default OffenceMatcher
