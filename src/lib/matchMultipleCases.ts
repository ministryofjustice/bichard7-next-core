import type { CaseMatcherOutcome } from "src/lib/caseMatcher/caseMatcher"
import offenceHasFinalResult from "src/lib/offenceMatcher/offenceHasFinalResult"
import type { OffenceMatcherOutcome } from "src/lib/offenceMatcher/offenceMatcher"
import { matchOffences } from "src/lib/offenceMatcher/offenceMatcher"
import offencesAreEqual from "src/lib/offenceMatcher/offencesAreEqual"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"

export type MultipleCaseMatcherOutcome = {
  ambiguousHoOffences: Offence[]
  matchedOffences: Map<Offence, PncOffence>
  duplicateHoOffences: Map<Offence, OffenceMatcherOutcome[]>
  unmatchedPNCOffences: boolean
}

const matchMultipleCases = (
  hoOffences: Offence[],
  caseMatcherOutcome: CaseMatcherOutcome,
  hearingDate?: Date
): MultipleCaseMatcherOutcome => {
  const result: MultipleCaseMatcherOutcome = {
    ambiguousHoOffences: [],
    matchedOffences: new Map(),
    duplicateHoOffences: new Map(),
    unmatchedPNCOffences: true
  }

  // Iterate over the HO offences, and for each one determine:
  //    (a) which PNC offence(s) it is matched with;
  //    (b) which other offences (if any) it is identical to.
  // Also create a set of all available PNC offences (all those in the matched cases).

  const matchesByHoOffence = new Map<Offence, PncOffence[]>()
  const identicalOffenceSets = new Map<Offence, Offence[]>()
  const availablePNCOffences = new Set<PncOffence>()
  // Holds a list of PNC offences that match against ambiguous ho offences.
  const pncOffencesMatchedWithAmbiguousHOOffences: PncOffence[] = []

  hoOffences.forEach((hoOffence) => {
    const matchingPNCOffences: PncOffence[] = []
    matchesByHoOffence.set(hoOffence, matchingPNCOffences)
    caseMatcherOutcome.courtCaseMatches.forEach(({ courtCase, offenceMatcherOutcome }) => {
      courtCase.offences.forEach((offence) => availablePNCOffences.add(offence))
      const pncOffenceMatch = offenceMatcherOutcome.matchedOffences.filter((match) => match.hoOffence === hoOffence)
      if (pncOffenceMatch.length === 1) {
        matchingPNCOffences.push(pncOffenceMatch[0].pncOffence)
      }
      // check whether the HO offence was found to be a duplicate in this court case, and record the fact if so.
      if (offenceMatcherOutcome.duplicateHoOffences.includes(hoOffence)) {
        if (!result.duplicateHoOffences.get(hoOffence)) {
          result.duplicateHoOffences.set(hoOffence, [])
        }
        const cases = result.duplicateHoOffences.get(hoOffence)
        cases?.push(offenceMatcherOutcome)
      }
    })

    let identicalOffenceFound = false
    for (const otherPncOffence of identicalOffenceSets.keys()) {
      if (offencesAreEqual(hoOffence, otherPncOffence, true)) {
        identicalOffenceSets.get(otherPncOffence)?.push(hoOffence)
        identicalOffenceFound = true
      }
    }

    if (!identicalOffenceFound) {
      if (!identicalOffenceSets.get(hoOffence)) {
        identicalOffenceSets.set(hoOffence, [])
      }
      identicalOffenceSets.get(hoOffence)?.push(hoOffence)
    }
  })

  // Process all the offences which are in a group of one (ie are not identical to any other
  // offence) and where only one matching PNC offence exists
  // i.e. assignment can be made without further matching.
  for (const offences of identicalOffenceSets.values()) {
    if (offences.length === 1) {
      const hoOffence = offences[0]
      const matchingPncOffences = matchesByHoOffence.get(hoOffence)
      if (matchingPncOffences?.length === 1) {
        const pncOffence = matchingPncOffences[0]
        result.matchedOffences.set(hoOffence, pncOffence)
        availablePNCOffences.delete(pncOffence)
      }
    }
  }

  // Process all the groups of more than one identical offences.
  for (const offences of identicalOffenceSets.values()) {
    // re-try offence matching again even if only a single ho offence in the set as
    // we can now take adjudication status of PNC offences into account where matches are found in
    // more than one court case. Don't retry if it is a single HO offence and only one PNC match was
    // detected. Don't retry matching if the ho offence has duplicates.
    const matchingPncOffences = matchesByHoOffence.get(offences[0])
    if (
      offences.length > 1 ||
      (offences.length === 1 &&
        (!matchingPncOffences || matchingPncOffences.length > 1) &&
        !result.duplicateHoOffences.get(offences[0]))
    ) {
      // Match all the offences in the group against the available PNC offences.
      const offenceMatchingOutcome = matchOffences(offences, Array.from(availablePNCOffences), {
        hearingDate,
        attemptManualMatch: true
      })
      // Now check all the offences in the group to see which match.
      offences.forEach((hoOffence) => {
        const matchedOffences = offenceMatchingOutcome.matchedOffences.filter((match) => match.hoOffence === hoOffence)

        if (matchOffences.length === 0) {
          // If it doesn't match a PNC offence, it has been added by the court.
          if (matchingPncOffences && matchingPncOffences.length > 1) {
            // If we had matches before then consider this to be ambiguous and don't consider the
            // originally matched PNC offences to be unmatched. This will prevent unnecessary
            // HO100304 errors.
            result.ambiguousHoOffences.push(hoOffence)
            // Must also make a note of PNC offences that match against ambiguous ho
            // offences as these should be considered to have matched when determining if a CCR
            // group no longer has any as a result of applying the multiple court case matching algorithm.
            matchingPncOffences.forEach((pncOffence) => {
              pncOffencesMatchedWithAmbiguousHOOffences.push(pncOffence)
              availablePNCOffences.delete(pncOffence)
            })
          }
        } else {
          const { pncOffence } = matchedOffences[0]
          // If it does match, record the match and remove the PNC offence from the list of available ones.
          result.matchedOffences.set(hoOffence, pncOffence)
          availablePNCOffences.delete(pncOffence)
        }
      })
    }
  }

  // Record whether there are still unmatched PNC offences which are not final.
  let unmatchedPNCOffences = false
  for (const pncOffence of availablePNCOffences) {
    if (unmatchedPNCOffences) {
      break
    }

    unmatchedPNCOffences = !offenceHasFinalResult(pncOffence)
    // If the PNC offence is a duplicate match in any of the matching cases, it should not be regarded as unmatched.
    if (unmatchedPNCOffences) {
      for (const duplicates of result.duplicateHoOffences.values()) {
        if (!unmatchedPNCOffences) {
          break
        }

        for (const singleCaseMatchingOutcome of duplicates) {
          if (!unmatchedPNCOffences) {
            break
          }

          unmatchedPNCOffences = !singleCaseMatchingOutcome.pncOffencesMatchedIncludingDuplicates.includes(pncOffence)
        }
      }
    }

    // Only consider it to be unmatched if there is at least one offence in the same CCR group that
    // has a match. This addresses scenario whereby as a result of multiple matching algorithm
    // there are no longer any matches against a particular CCR group. Previously this would have
    // raised HO100304 and therefore couldn't automate.
    let groupFound = false

    for (const { courtCase } of caseMatcherOutcome.courtCaseMatches) {
      if (groupFound || !unmatchedPNCOffences) {
        break
      }

      const cCRPNCOffences = new Set<PncOffence>()
      courtCase.offences.forEach((offence) => cCRPNCOffences.add(offence))
      // If the current CCR group contains the unmatched PNC offence then only set the unmatched
      // flag if we still have a matched offence in the same CCR group.
      if (cCRPNCOffences.has(pncOffence)) {
        groupFound = true
        let matchFoundInGroup = false
        for (const cCRPncOffence of cCRPNCOffences) {
          if (matchFoundInGroup) {
            break
          }

          if (
            [...result.matchedOffences.values()].includes(cCRPncOffence) ||
            pncOffencesMatchedWithAmbiguousHOOffences.includes(cCRPncOffence)
          ) {
            matchFoundInGroup = true
          }
          if (!matchFoundInGroup) {
            unmatchedPNCOffences = false
            caseMatcherOutcome.courtCaseMatches = caseMatcherOutcome.courtCaseMatches.filter(
              (match) => match.courtCase !== courtCase
            )
          }
        }
      }
    }

    // if we didn't find a matching CCR group then it must have been removed because all offences
    // in the CCR group were unmatched when processing a previous PNC offence. If this is the case
    // the we don't consider there to be unmatched PNC offences because of the current PNC offence being unmatched.
    if (!groupFound && unmatchedPNCOffences) {
      unmatchedPNCOffences = false
    }
  }

  result.unmatchedPNCOffences = unmatchedPNCOffences

  return result
}

export default matchMultipleCases
