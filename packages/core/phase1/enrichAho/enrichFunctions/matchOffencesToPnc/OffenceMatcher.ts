import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/errorPaths"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
import isCcrValid from "../../../lib/isCcrValid"
import isSequenceValid from "../../../lib/isSequenceValid"
import { CaseType } from "./annotatePncMatch"
import generateCandidate from "./generateCandidate"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { pushToArrayInMap } from "./matchOffencesToPnc"
import offenceHasFinalResult from "./offenceHasFinalResult"
import offencesHaveEqualResults from "./offencesHaveEqualResults"

export type Candidate = {
  adjudicationMatch: boolean
  exactDateMatch: boolean
  fuzzyDateMatch: true
  hoOffence: Offence
  manualCcrMatch: boolean
  manualSequenceMatch: boolean
  pncOffence: PncOffenceWithCaseRef
}

type CandidateFilterOptions = {
  adjudicationMatch?: boolean
  convictionDateMatch?: boolean
  exactDateMatch?: boolean
  includeFinal?: boolean
  manualCcrMatch?: boolean
  manualSequenceMatch?: boolean
  startDateMatch?: boolean
}

const ho100304 = { code: ExceptionCode.HO100304, path: errorPaths.case.asn }

class OffenceMatcher {
  private candidates = new Map<Offence, Candidate[]>()

  public matches = new Map<Offence, PncOffenceWithCaseRef>()

  public exceptions: Exception[] = []

  constructor(
    private hoOffences: Offence[],
    private pncOffences: PncOffenceWithCaseRef[],
    private hearingDate: Date
  ) {}

  get hasExceptions(): boolean {
    return this.exceptions.length > 0
  }

  get matchedHoOffences(): Offence[] {
    return [...this.matches.keys()]
  }

  get matchedPncOffences(): PncOffenceWithCaseRef[] {
    return [...this.matches.values()]
  }

  get hasPenaltyCase(): boolean {
    return this.pncOffences.some((pncOffence) => pncOffence.caseType === CaseType.penalty)
  }

  unmatchedCandidates(options: CandidateFilterOptions): Map<Offence, Candidate[]> {
    options.includeFinal ??= true

    const candidates = new Map<Offence, Candidate[]>()
    for (const [hoOffence, candidatePncOffences] of this.candidates.entries()) {
      if ([...this.matches.keys()].includes(hoOffence)) {
        continue
      }

      const unmatchedCandidatePncOffences = candidatePncOffences
        .filter((candidate) => !this.matchedPncOffences.includes(candidate.pncOffence))
        .filter((c) => !options.exactDateMatch || c.exactDateMatch === options.exactDateMatch)
        .filter((c) => !options.adjudicationMatch || c.adjudicationMatch === options.adjudicationMatch)
        .filter((c) => options.includeFinal || !offenceHasFinalResult(c.pncOffence.pncOffence))
        .filter((c) => !options.manualSequenceMatch || c.manualSequenceMatch)
        .filter((c) => !options.manualCcrMatch || c.manualCcrMatch)

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

  unmatchedPncOffencesInCase(caseReferences: string[]): PncOffenceWithCaseRef[] {
    return this.unmatchedPncOffences.filter((pncOffence) => caseReferences.includes(pncOffence.caseReference))
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

  groupOffences(options: CandidateFilterOptions = {}): Candidate[][] {
    const groups: Candidate[][] = []

    const candidates = new Set<Candidate>(Array.from(this.unmatchedCandidates(options).values()).flat())

    const findGroup = (candidateSet: Set<Candidate>): Candidate[] => {
      const startingPoint = candidates.values().next().value
      const group = new Set<Candidate>([startingPoint])

      let addedToGroup = true
      while (addedToGroup) {
        addedToGroup = false
        for (const candidate of candidateSet.values()) {
          if (group.has(candidate)) {
            continue
          }

          for (const groupCandidate of group) {
            if (
              candidate.hoOffence === groupCandidate.hoOffence ||
              candidate.pncOffence === groupCandidate.pncOffence
            ) {
              group.add(candidate)
              addedToGroup = true
            }
          }
        }
      }

      return Array.from(group.values())
    }

    while (candidates.size > 0) {
      const group = findGroup(candidates)
      groups.push(group)
      for (const candidate of group) {
        candidates.delete(candidate)
      }
    }

    return groups
  }

  hoOffenceWasAlreadyMatched(hoOffence: Offence): boolean {
    return this.matchedHoOffences.includes(hoOffence)
  }

  checkGroupForExceptions(group: Candidate[]): void | Exception[] {
    const exceptions: Exception[] = []

    const matchingCourtCaseReferences = group.reduce((acc, candidate) => {
      acc.add(candidate.pncOffence.caseReference)
      return acc
    }, new Set<string>())

    const hoOffences = group.reduce((acc, candidate) => acc.add(candidate.hoOffence), new Set<Offence>())
    const pncOffences = Array.from(
      group.reduce((acc, candidate) => acc.add(candidate.pncOffence), new Set<PncOffenceWithCaseRef>())
    )

    if (
      matchingCourtCaseReferences.size > 1 &&
      (!offencesHaveEqualResults(Array.from(hoOffences)) || pncOffences.length !== hoOffences.size)
    ) {
      const courtCaseMatched = pncOffences.some((pncOffence) => pncOffence.caseType === CaseType.court)
      const penaltyCaseMatched = pncOffences.some((pncOffence) => pncOffence.caseType === CaseType.penalty)

      for (const hoOffence of hoOffences) {
        if (courtCaseMatched && penaltyCaseMatched) {
          exceptions.push({
            code: ExceptionCode.HO100328,
            path: errorPaths.case.asn
          })
        } else {
          exceptions.push({
            code: ExceptionCode.HO100332,
            path: errorPaths.offence(this.hoOffences.indexOf(hoOffence)).reasonSequence
          })
          hoOffence.CourtCaseReferenceNumber = null
        }
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

    if (hoOffences.size < pncOffences.length) {
      exceptions.push(ho100304)
      return exceptions
    }
  }

  matchManualSequenceNumbers() {
    let exceptions: Exception[] = []

    exceptions = []
    for (const [i, hoOffence] of this.unmatchedHoOffences.entries()) {
      const hasManualSequence =
        !!hoOffence.ManualSequenceNumber && !!hoOffence.CriminalProsecutionReference.OffenceReasonSequence

      if (hasManualSequence) {
        const rawSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
        if (!!rawSequence && !isSequenceValid(rawSequence)) {
          exceptions.push({ code: ExceptionCode.HO100228, path: errorPaths.offence(i).reasonSequence })
          continue
        }

        const sequence = Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence)
        const pncOffencesWithMatchingSequence = this.pncOffences.filter(
          (pncOffence) => pncOffence.pncOffence.offence.sequenceNumber === sequence
        )

        if (pncOffencesWithMatchingSequence.length === 0) {
          exceptions.push({ code: ExceptionCode.HO100312, path: errorPaths.offence(i).reasonSequence })
          continue
        }
      }

      const hasManualCCR = !!hoOffence.ManualCourtCaseReference && !!hoOffence.CourtCaseReferenceNumber

      if (hasManualCCR) {
        if (!isCcrValid(hoOffence.CourtCaseReferenceNumber!)) {
          exceptions.push({ code: ExceptionCode.HO100203, path: errorPaths.offence(i).courtCaseReference })
          continue
        }
      }

      if (hasManualSequence || hasManualCCR) {
        const optionSets: CandidateFilterOptions[] = [
          { manualCcrMatch: true, manualSequenceMatch: true },
          { manualSequenceMatch: true },
          { manualCcrMatch: true }
        ]

        for (const options of optionSets) {
          const candidatePncOffences = this.candidatesForHoOffence(hoOffence, options)

          if (candidatePncOffences.length === 1) {
            this.matches.set(hoOffence, candidatePncOffences[0])
            break
          } else if (candidatePncOffences.length > 1) {
            const courtCases = candidatePncOffences.reduce((acc: Set<string>, pncOffence) => {
              acc.add(pncOffence.caseReference)
              return acc
            }, new Set<string>())
            const code = courtCases.size > 1 ? ExceptionCode.HO100332 : ExceptionCode.HO100310
            exceptions.push({ code, path: errorPaths.offence(i).reasonSequence })
            if (code === ExceptionCode.HO100332) {
              hoOffence.CourtCaseReferenceNumber = null
            }

            break
          }
        }

        const remainingCandidates = this.candidatesForHoOffence(hoOffence)

        if (!this.hoOffenceWasAlreadyMatched(hoOffence) && remainingCandidates.length === 0) {
          exceptions.push({ code: ExceptionCode.HO100320, path: errorPaths.offence(i).reasonSequence })
        }
      }
    }

    exceptions.forEach(this.addException, this)
  }

  matchGroup(candidates: Candidate[]): void {
    const exceptions = this.checkGroupForExceptions(candidates)
    if (exceptions) {
      return
    }

    const hoOffences = Array.from(
      candidates.reduce((acc, candidate) => acc.add(candidate.hoOffence), new Set<Offence>())
    )
    const pncOffences = Array.from(
      candidates.reduce((acc, candidate) => acc.add(candidate.pncOffence), new Set<PncOffenceWithCaseRef>())
    )

    for (const index of pncOffences.keys()) {
      this.matches.set(hoOffences[index], pncOffences[index])
    }
  }

  matchGroups({ includeFinal }: Pick<CandidateFilterOptions, "includeFinal">) {
    const exactAndAdjudicationGroups = this.groupOffences({
      exactDateMatch: true,
      adjudicationMatch: true,
      includeFinal
    })
    exactAndAdjudicationGroups.forEach(this.matchGroup, this)

    const fuzzyAndAdjudicationGroups = this.groupOffences({ adjudicationMatch: true, includeFinal })
    fuzzyAndAdjudicationGroups.forEach(this.matchGroup, this)

    const exactMatchGroups = this.groupOffences({ exactDateMatch: true, includeFinal })
    exactMatchGroups.forEach(this.matchGroup, this)

    const fuzzyGroups = this.groupOffences({ includeFinal })
    fuzzyGroups.forEach(this.matchGroup, this)
  }

  matchOffences() {
    if (!this.hasPenaltyCase) {
      this.matchFullCourtCases({ includeFinal: false })
      this.matchGroups({ includeFinal: false })
      this.matchFullCourtCases({ includeFinal: true })
    }

    this.matchGroups({ includeFinal: true })
  }

  checkForExceptions() {
    const groups = this.groupOffences()
    for (const group of groups) {
      const exceptions = this.checkGroupForExceptions(group)
      if (exceptions) {
        exceptions.forEach(this.addException, this)
      }
    }
  }

  matchFullCourtCases({ includeFinal }: Pick<CandidateFilterOptions, "includeFinal">) {
    // for each court case (ordered by largest first)
    const courtCaseCounts = this.pncOffences.reduce((acc: Record<string, number>, pncOffence) => {
      const ccr = pncOffence.caseReference

      if (!includeFinal && offenceHasFinalResult(pncOffence.pncOffence)) {
        return acc
      }

      if (!(ccr in acc)) {
        acc[ccr] = 0
      }

      acc[ccr] += 1
      return acc
    }, {})

    const courtCasesGroupedByCount = Object.entries(courtCaseCounts).reduce(
      (acc: Map<number, string[]>, [ccr, count]) => {
        pushToArrayInMap(acc, count, ccr)
        return acc
      },
      new Map<number, string[]>()
    )

    const sortedCases = Array.from(courtCasesGroupedByCount.entries())
      .sort((a, b) => b[0] - a[0])
      .map((entry) => entry[1])

    // try and match
    for (const courtCaseReferences of sortedCases) {
      const matchers = courtCaseReferences.map((courtCaseReference) => {
        const offences = this.unmatchedPncOffencesInCase([courtCaseReference]).filter(
          (pncOffence) => includeFinal || !offenceHasFinalResult(pncOffence.pncOffence)
        )

        const singleCaseOffenceMatcher = new OffenceMatcher(this.unmatchedHoOffences, offences, this.hearingDate)

        singleCaseOffenceMatcher.findCandidates()
        singleCaseOffenceMatcher.matchGroups({ includeFinal })

        return { matcher: singleCaseOffenceMatcher, offenceCount: offences.length }
      })

      const successfulMatchers = matchers.filter(
        ({ matcher, offenceCount }) => matcher.matchedPncOffences.length >= offenceCount
      )

      const matchedHoOffences = successfulMatchers.map(({ matcher }) => Array.from(matcher.matches.keys())).flat()
      const hasConflicts = matchedHoOffences.some(
        (hoOffence) => matchedHoOffences.filter((otherHoOffence) => hoOffence === otherHoOffence).length > 1
      )

      if (hasConflicts) {
        continue
      }

      for (const { matcher } of successfulMatchers) {
        for (const [hoOffence, pncOffence] of matcher.matches.entries()) {
          this.matches.set(hoOffence, pncOffence)
        }
      }
    }
  }

  match() {
    this.findCandidates()
    this.matchManualSequenceNumbers()
    if (this.exceptions.length > 0) {
      return
    }

    this.matchOffences()
    this.checkForExceptions()
    if (this.matches.size === 0 && this.exceptions.length === 0) {
      this.addException(ho100304)
    }
  }
}

export default OffenceMatcher
