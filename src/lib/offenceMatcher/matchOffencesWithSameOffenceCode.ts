import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
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
    allPncOffencesMatched: false,
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
  pncOffences.forEach((pncOffence) => {
    if (pncOffenceAlreadyMatched(pncOffence, result)) {
      return
    }

    const matchingHoOffences = unmatchedHoOffences.filter((hoOffence) => datesMatchApproximately(hoOffence, pncOffence))

    if (matchingHoOffences.length === 0) {
      return
    }

    if (matchingHoOffences.length > 1 && !offencesHaveEqualResults(matchingHoOffences)) {
      result.duplicateHoOffences = result.duplicateHoOffences.concat(matchingHoOffences)

      if (!result.pncOffencesMatchedIncludingDuplicates.includes(pncOffence)) {
        result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
      }

      return
    }

    result.matchedOffences.push({ hoOffence: matchingHoOffences[0], pncOffence })
    result.pncOffencesMatchedIncludingDuplicates.push(pncOffence)
  })

  return result
}

export default matchOffencesWithSameOffenceCode
