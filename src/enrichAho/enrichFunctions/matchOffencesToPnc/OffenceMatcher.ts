import errorPaths from "src/lib/errorPaths"
import isCcrValid from "src/lib/isCcrValid"
import isSequenceValid from "src/lib/isSequenceValid"
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
  exactDateMatch: boolean
  startDateMatch: boolean
  fuzzyDateMatch: true
  convictionDateMatch: boolean
  adjudicationMatch: boolean
}

type CandidateFilterOptions = {
  exactDateMatch?: boolean
  startDateMatch?: boolean
  convictionDateMatch?: boolean
  adjudicationMatch?: boolean
  courtCaseReference?: string
  courtCaseReferences?: string[]
  includeFinal?: boolean
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
    options.includeFinal ??= true

    const candidates = new Map<Offence, Candidate[]>()
    for (const [hoOffence, candidatePncOffences] of this.candidates.entries()) {
      if ([...this.matches.keys()].includes(hoOffence)) {
        continue
      }

      const unmatchedCandidatePncOffences = candidatePncOffences
        .filter((candidate) => !this.matchedPncOffences.includes(candidate.pncOffence))
        .filter((c) => !options.exactDateMatch || c.exactDateMatch === options.exactDateMatch)
        .filter((c) => !options.startDateMatch || c.startDateMatch === options.startDateMatch)
        .filter((c) => !options.convictionDateMatch || c.convictionDateMatch === options.convictionDateMatch)
        .filter((c) => !options.adjudicationMatch || c.adjudicationMatch === options.adjudicationMatch)
        .filter((c) => !options.courtCaseReference || c.pncOffence.caseReference === options.courtCaseReference)
        .filter((c) => !options.courtCaseReferences || options.courtCaseReferences.includes(c.pncOffence.caseReference))
        .filter((c) => options.includeFinal || !offenceHasFinalResult(c.pncOffence.pncOffence))

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

  get matchedNonFinalPncOffences(): PncOffenceWithCaseRef[] {
    return Array.from(this.matches.values()).filter((pncOffence) => !offenceHasFinalResult(pncOffence.pncOffence))
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

  candidatesForPncOffence(pncOffence: PncOffenceWithCaseRef, options: CandidateFilterOptions = {}): Offence[] {
    return [...this.unmatchedCandidates(options).keys()].filter((hoOffence) =>
      this.unmatchedCandidates(options)
        .get(hoOffence)
        ?.some((candidate) => candidate.pncOffence === pncOffence)
    )
  }

  hasMatch(candidate: Candidate): boolean {
    return !!this.matches.get(candidate.hoOffence) || Array.from(this.matches.values()).includes(candidate.pncOffence)
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

  checkGroupForExceptions(group: Candidate[]): void | Exception[] {
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

    const nonFinalPncOffences = Array.from(pncOffences.values()).filter((o) => !offenceHasFinalResult(o.pncOffence))

    if (hoOffences.size < nonFinalPncOffences.length) {
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
        const candidatePncOffences = this.candidatesForHoOffence(hoOffence)

        const matchingPncOffences = candidatePncOffences?.filter((pncOffence) =>
          offenceManuallyMatches(hoOffence, pncOffence)
        )
        if (matchingPncOffences.length === 1) {
          this.matches.set(hoOffence, matchingPncOffences[0])
        } else if (matchingPncOffences.length === 0) {
          exceptions.push({ code: ExceptionCode.HO100320, path: errorPaths.offence(i).reasonSequence })
        } else if (matchingPncOffences.length > 1) {
          const courtCases = matchingPncOffences.reduce((acc: Set<string>, pncOffence) => {
            acc.add(pncOffence.caseReference)
            return acc
          }, new Set<string>())
          const code = courtCases.size > 1 ? ExceptionCode.HO100332 : ExceptionCode.HO100310
          exceptions.push({ code, path: errorPaths.offence(i).reasonSequence })
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

    for (const candidate of candidates) {
      if (
        !this.pncOffenceWasAlreadyMatched(candidate.pncOffence) &&
        !this.hoOffenceWasAlreadyMatched(candidate.hoOffence)
      ) {
        this.matches.set(candidate.hoOffence, candidate.pncOffence)
      }
    }
  }

  matchGroups({ includeFinal }: Pick<CandidateFilterOptions, "includeFinal">) {
    const exactAndAdjudicationGroups = this.groupOffences({
      exactDateMatch: true,
      adjudicationMatch: true,
      includeFinal
    })
    exactAndAdjudicationGroups.forEach(this.matchGroup, this)

    const startDateAndAdjudicationGroups = this.groupOffences({
      startDateMatch: true,
      adjudicationMatch: true,
      includeFinal
    })
    startDateAndAdjudicationGroups.forEach(this.matchGroup, this)

    const fuzzyAndAdjudicationGroups = this.groupOffences({ adjudicationMatch: true, includeFinal })
    fuzzyAndAdjudicationGroups.forEach(this.matchGroup, this)

    const exactMatchGroups = this.groupOffences({ exactDateMatch: true, includeFinal })
    exactMatchGroups.forEach(this.matchGroup, this)

    const startDateMatchGroups = this.groupOffences({ startDateMatch: true, includeFinal })
    startDateMatchGroups.forEach(this.matchGroup, this)

    const fuzzyGroups = this.groupOffences({ includeFinal })
    fuzzyGroups.forEach(this.matchGroup, this)
  }

  matchOffences() {
    this.matchFullCourtCases({ includeFinal: false })
    this.matchGroups({ includeFinal: false })
    this.matchFullCourtCases({ includeFinal: true })
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
