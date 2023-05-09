import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type MatchCandidates from "./MatchCandidates"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"

export const hasNoMatchConflicts = (
  hoOffence: Offence,
  pncOffence: PncOffenceWithCaseRef,
  candidates: MatchCandidates,
  exact?: boolean
): boolean => {
  const otherMatchingHoOffences = candidates.forPncOffence(pncOffence, exact)
  if (!otherMatchingHoOffences) {
    return false
  }

  return otherMatchingHoOffences.every((candidateHoOffence) => {
    const filteredPncMatchCandidates = candidates
      .forHoOffence(candidateHoOffence)
      ?.filter((candidatePncOffence) => candidatePncOffence !== pncOffence)

    const hasExactMatchToPncOffence = candidates.exactMatched(candidateHoOffence, pncOffence)

    return candidateHoOffence === hoOffence || (!hasExactMatchToPncOffence && filteredPncMatchCandidates?.length >= 1)
  })
}

export const selectMatch = (hoOffence: Offence, candidates: MatchCandidates): PncOffenceWithCaseRef | undefined => {
  const candidatePncOffences = candidates.forHoOffence(hoOffence)
  if (candidatePncOffences.length === 1) {
    const candidatePncOffence = candidatePncOffences[0]
    if (candidates.forPncOffence(candidatePncOffence)?.length === 1) {
      return candidatePncOffence
    } else {
      if (hasNoMatchConflicts(hoOffence, candidatePncOffence, candidates)) {
        return candidatePncOffence
      }
    }
  } else {
    const exactMatches = candidates.forHoOffence(hoOffence, true)
    if (exactMatches.length === 1) {
      const candidatePncOffence = exactMatches[0]
      if (hasNoMatchConflicts(hoOffence, candidatePncOffence, candidates, true)) {
        return candidatePncOffence
      }
    }
  }
  return undefined
}
