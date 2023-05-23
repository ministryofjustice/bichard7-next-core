import errorPaths from "src/lib/errorPaths"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import offencesMatch from "../enrichCourtCases/offenceMatcher/offencesMatch"
import { offencesHaveEqualResults } from "../enrichCourtCases/offenceMatcher/resultsAreEqual"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { pushToArrayInMap } from "./matchOffencesToPnc"

type Candidate = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
  exact: boolean
}

type OffenceMatchingGroup = {
  hoOffences: Set<Offence>
  pncOffences: Set<PncOffenceWithCaseRef>
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
          normaliseCCR(courtCase) === normaliseCCR(pncOffence.courtCaseReference)
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

  get unmatchedCandidates() {
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

  reset(): void {
    this.exceptions = []
    this.matches = new Map<Offence, PncOffenceWithCaseRef>()
  }

  hasCandidate(candidate: Candidate): boolean {
    return !!this.candidates.get(candidate.hoOffence)?.some((c) => c.pncOffence === candidate.pncOffence)
  }

  findCandidates(exact: boolean) {
    for (const hoOffence of this.hoOffences) {
      for (const pncOffence of this.pncOffences) {
        const candidate = { hoOffence, pncOffence, exact }
        if (
          !this.hasCandidate(candidate) &&
          offencesMatch(hoOffence, pncOffence.pncOffence, { exactDateMatch: exact })
        ) {
          pushToArrayInMap(this.candidates, hoOffence, candidate)
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

  candidatesForHoOffence(hoOffence: Offence, exact?: boolean): PncOffenceWithCaseRef[] {
    return (
      this.unmatchedCandidates
        .get(hoOffence)
        ?.filter((c) => exact === undefined || c.exact === exact)
        .map((c) => c.pncOffence) ?? []
    )
  }

  candidatesForPncOffence(pncOffence: PncOffenceWithCaseRef, exact?: boolean): Offence[] {
    return [...this.unmatchedCandidates.keys()].filter((hoOffence) =>
      this.unmatchedCandidates
        .get(hoOffence)
        ?.filter((c) => exact === undefined || c.exact === exact)
        .some((candidate) => candidate.pncOffence === pncOffence)
    )
  }

  hasMatchCandidate(hoOffence: Offence, pncOffence: PncOffenceWithCaseRef, exact: boolean): boolean {
    return !!this.candidates.get(hoOffence)?.some((match) => match.pncOffence === pncOffence && (!exact || match.exact))
  }

  hasNoMatchConflicts(hoOffence: Offence, pncOffence: PncOffenceWithCaseRef, exact?: boolean): boolean {
    const otherMatchingHoOffences = this.candidatesForPncOffence(pncOffence, exact)
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
      const exactMatches = this.candidatesForHoOffence(hoOffence, true)
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

  groupOffences(): OffenceMatchingGroup[] {
    const groups: OffenceMatchingGroup[] = []
    for (const hoOffence of this.unmatchedCandidates.keys()) {
      let foundMatch = false
      for (const group of groups) {
        if (this.hoOffencesSharePncOffenceMatch(hoOffence, group.hoOffences.values().next().value)) {
          group.hoOffences.add(hoOffence)
          this.candidatesForHoOffence(hoOffence).forEach((c) => group.pncOffences.add(c))
          foundMatch = true
        }
      }

      if (!foundMatch) {
        const newGroup = { hoOffences: new Set<Offence>(), pncOffences: new Set<PncOffenceWithCaseRef>() }
        newGroup.hoOffences.add(hoOffence)
        this.candidatesForHoOffence(hoOffence).forEach((c) => newGroup.pncOffences.add(c))
        groups.push(newGroup)
      }
    }
    return groups
  }

  pncOffenceWasAlreadyMatched(pncOffence: PncOffenceWithCaseRef): boolean {
    return this.matchedPncOffences.includes(pncOffence)
  }

  checkGroupForConflicts(group: OffenceMatchingGroup): boolean {
    let conflicts = false
    const matchingCourtCaseReferences = [...group.pncOffences.values()].reduce((acc, pncOff) => {
      acc.add(pncOff.courtCaseReference)
      return acc
    }, new Set<string>())

    if (
      matchingCourtCaseReferences.size > 1 &&
      (!offencesHaveEqualResults([...group.hoOffences.values()]) || group.pncOffences.size !== group.hoOffences.size)
    ) {
      for (const hoOffence of group.hoOffences.values()) {
        this.exceptions.push({
          code: ExceptionCode.HO100332,
          path: errorPaths.offence(this.hoOffences.indexOf(hoOffence)).reasonSequence
        })
      }
      conflicts = true
    } else if (!offencesHaveEqualResults([...group.hoOffences.values()])) {
      for (const hoOffence of group.hoOffences.values()) {
        this.exceptions.push({
          code: ExceptionCode.HO100310,
          path: errorPaths.offence(this.hoOffences.indexOf(hoOffence)).reasonSequence
        })
      }
      conflicts = true
    }

    return conflicts
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

  matchGroups() {
    const groupedMatches = this.groupOffences()
    for (const group of groupedMatches) {
      const groupsHasConflicts = this.checkGroupForConflicts(group)
      if (groupsHasConflicts) {
        continue
      }
      if (group.pncOffences.size <= group.hoOffences.size) {
        const pncIterator = group.pncOffences.values()
        for (const hoOffence of group.hoOffences.values()) {
          const pncOffence = pncIterator.next().value
          if (!pncOffence) {
            break
          }
          if (!this.pncOffenceWasAlreadyMatched(pncOffence)) {
            this.matches.set(hoOffence, pncOffence)
          }
        }
      } else {
        this.exceptions.push(ho100304)
      }
    }
  }

  resolveMatches() {
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

  match() {
    this.findCandidates(true)
    this.resolveMatches()

    if (this.successfulMatch()) {
      return
    }
    this.reset()
    this.findCandidates(false)
    this.resolveMatches()
  }
}

export default OffenceMatcher
