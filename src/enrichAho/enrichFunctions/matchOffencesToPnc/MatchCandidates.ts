import type { Offence } from "src/types/AnnotatedHearingOutcome"
import offenceHasFinalResult from "../enrichCourtCases/offenceMatcher/offenceHasFinalResult"
import type { MatchingResult, PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { pushToArrayInMap } from "./matchOffencesToPnc"

type MatchCandidate = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
  exact: boolean
}

class MatchCandidates {
  private matches: MatchCandidate[] = []

  private hoOffenceIndex = new Map<Offence, MatchCandidate[]>()

  private pncOffenceIndex = new Map<PncOffenceWithCaseRef, MatchCandidate[]>()

  constructor(matches: MatchCandidate[] = []) {
    matches.forEach((match) => this.add(match))
  }

  add(candidate: MatchCandidate) {
    this.matches.push(candidate)
    pushToArrayInMap(this.hoOffenceIndex, candidate.hoOffence, candidate)
    pushToArrayInMap(this.pncOffenceIndex, candidate.pncOffence, candidate)
  }

  forHoOffence(hoOffence: Offence, exact?: boolean): PncOffenceWithCaseRef[] {
    return this.matches
      .filter((match) => match.hoOffence === hoOffence && (exact === undefined || match.exact === exact))
      .map((match) => match.pncOffence)
  }

  forPncOffence(pncOffence: PncOffenceWithCaseRef, exact?: boolean): Offence[] {
    return this.matches
      .filter((match) => match.pncOffence === pncOffence && (exact === undefined || match.exact === exact))
      .map((match) => match.hoOffence)
  }

  matched(hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): boolean {
    return this.matches.some((match) => match.hoOffence === hoOffence && match.pncOffence === pncOffence)
  }

  filter(result: MatchingResult): MatchCandidates {
    const remainingMatches = this.matches.filter(
      (match) => !result.matched.some((m) => m.hoOffence === match.hoOffence || m.pncOffence === match.pncOffence)
    )

    return new MatchCandidates(remainingMatches)
  }

  matchedHoOffences(): Offence[] {
    return [...this.hoOffenceIndex.keys()]
  }

  matchedPncOffences(): PncOffenceWithCaseRef[] {
    return [...this.pncOffenceIndex.keys()]
  }

  hoOffenceMatches(hoOffence: Offence): PncOffenceWithCaseRef[] {
    return this.hoOffenceIndex.get(hoOffence)?.map((match) => match.pncOffence) ?? []
  }

  pncOffenceMatches(pncOffence: PncOffenceWithCaseRef): Offence[] {
    return this.pncOffenceIndex.get(pncOffence)?.map((match) => match.hoOffence) ?? []
  }

  filterNonFinal(): MatchCandidates {
    const matches: MatchCandidate[] = []
    for (const matchCandidates of this.hoOffenceIndex.values()) {
      const nonFinalResults = matchCandidates.filter(
        (candidate) => !offenceHasFinalResult(candidate.pncOffence.pncOffence)
      )
      if (nonFinalResults.length > 0) {
        matches.push(...nonFinalResults)
      } else {
        matches.push(...matchCandidates)
      }
    }

    return new MatchCandidates(matches)
  }
}

export default MatchCandidates
