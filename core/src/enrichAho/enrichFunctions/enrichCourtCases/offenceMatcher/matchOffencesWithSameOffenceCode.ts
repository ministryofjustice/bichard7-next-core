import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import datesMatchApproximately from "./datesMatchApproximately"
import matchOffencesWithSameOffenceCodeAndStartDate from "./matchOffencesWithSameOffenceCodeAndStartDate"
import mergeOffenceMatcherOutcomes from "./mergeOffenceMatcherOutcomes"
import type { OffenceMatcherOutcome } from "./offenceMatcher"
import { hoOffenceAlreadyMatched, pncOffenceAlreadyMatched } from "./offenceMatcher"
import { offencesHaveEqualResults } from "./resultsAreEqual"

const getHoOffencesByStartDate = (hoOffences: Offence[]) =>
  hoOffences.reduce((acc: { [key: string]: Offence[] }, hoOffence) => {
    const startDate = hoOffence.ActualOffenceStartDate.StartDate.toISOString()

    if (!acc[startDate]) {
      acc[startDate] = []
    }

    acc[startDate].push(hoOffence)

    return acc
  }, {})

const getPncOffencesByStartDate = (pncOffences: PncOffence[]) =>
  pncOffences.reduce((acc: { [key: string]: PncOffence[] }, pncOffence) => {
    const startDate = pncOffence.offence.startDate.toISOString()

    if (!acc[startDate]) {
      acc[startDate] = []
    }

    acc[startDate].push(pncOffence)

    return acc
  }, {})

const matchOffencesWithSameOffenceCode = (
  hoOffences: Offence[],
  pncOffences: PncOffence[],
  applyMultipleCourtCaseMatchingLogic: boolean
): OffenceMatcherOutcome => {
  let result: OffenceMatcherOutcome = {
    allPncOffencesMatched: true,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }

  if (!hoOffences || !pncOffences || hoOffences.length === 0 || pncOffences.length === 0) {
    return result
  }

  // Use the start and end date to exactly match offences
  const hoOffencesByStartDate = getHoOffencesByStartDate(hoOffences)
  const pncOffencesByStartDate = getPncOffencesByStartDate(pncOffences)
  const startDates = new Set(Object.keys(hoOffencesByStartDate).concat(Object.keys(pncOffencesByStartDate)))

  startDates.forEach((startDate) => {
    const unmatchedPncOffences = pncOffencesByStartDate[startDate]?.filter(
      (pncOffence) => !pncOffenceAlreadyMatched(pncOffence, result)
    )

    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(
      hoOffencesByStartDate[startDate],
      unmatchedPncOffences,
      applyMultipleCourtCaseMatchingLogic
    )

    result = mergeOffenceMatcherOutcomes(result, outcome)
  })

  if (result.duplicateHoOffences.length > 0) {
    return result
  }

  // Use approximate date matching to match remaining offences
  const unmatchedHoOffences = hoOffences.filter((hoOffence) => !hoOffenceAlreadyMatched(hoOffence, result))
  const unmatchedPncOffences = pncOffences.filter((pncOffence) => !pncOffenceAlreadyMatched(pncOffence, result))

  const matchesByHoOffence = new Map<Offence, PncOffence[]>()
  const matchesByPncOffence = new Map<PncOffence, Offence[]>()

  const errorsFound = !result.allPncOffencesMatched || result.duplicateHoOffences.length > 0

  if (unmatchedPncOffences.length > 0 && !errorsFound) {
    unmatchedHoOffences.forEach((hoOffence) => {
      unmatchedPncOffences.forEach((pncOffence) => {
        if (datesMatchApproximately(hoOffence, pncOffence)) {
          if (!matchesByHoOffence.has(hoOffence)) {
            matchesByHoOffence.set(hoOffence, [])
          }
          matchesByHoOffence.get(hoOffence)?.push(pncOffence)

          if (!matchesByPncOffence.has(pncOffence)) {
            matchesByPncOffence.set(pncOffence, [])
          }
          matchesByPncOffence.get(pncOffence)?.push(hoOffence)
        }
      })
    })
  }
  pncOffences.forEach((pncOffence) => {
    const hoMatches = matchesByPncOffence.get(pncOffence)
    if (hoMatches && hoMatches.length > 0) {
      if (hoMatches.length > 1 && !offencesHaveEqualResults(hoMatches)) {
        result.duplicateHoOffences = result.duplicateHoOffences.concat(hoMatches)
        result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
      } else {
        let matchMade = false
        //TODO: Come back and refactor this since we don't really need matchMade
        for (const hoMatch of hoMatches) {
          if (matchMade) {
            break
          }
          if (matchesByHoOffence.has(hoMatch)) {
            result.matchedOffences.push({ hoOffence: hoMatch, pncOffence })
            result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
            matchesByHoOffence.delete(hoMatch)
            matchesByPncOffence.delete(pncOffence)
            matchMade = true
          }
        }
      }
    }
  })

  return result
}

export default matchOffencesWithSameOffenceCode
