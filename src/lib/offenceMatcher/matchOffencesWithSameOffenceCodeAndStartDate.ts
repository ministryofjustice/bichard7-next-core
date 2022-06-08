import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import type { OffenceMatcherOutcome } from "./offenceMatcher"
import { hoOffenceAlreadyMatched, pncOffenceAlreadyMatched } from "./offenceMatcher"
import { offencesHaveEqualResults } from "./resultsAreEqual"

const getHoOffencesByEndDate = (hoOffences: Offence[]) =>
  hoOffences.reduce((acc: { [key: string]: Offence[] }, hoOffence) => {
    const endDate = String(hoOffence.ActualOffenceEndDate?.EndDate.toISOString())

    if (!acc[endDate]) {
      acc[endDate] = []
    }

    acc[endDate].push(hoOffence)

    return acc
  }, {})

const getPncOffencesByEndDate = (pncOffences: PncOffence[]) =>
  pncOffences.reduce((acc: { [key: string]: PncOffence[] }, pncOffence) => {
    const endDate = String(pncOffence.offence.endDate?.toISOString())

    if (!acc[endDate]) {
      acc[endDate] = []
    }

    acc[endDate].push(pncOffence)

    return acc
  }, {})

const matchOffencesWithSameOffenceCodeAndStartDate = (
  hoOffences: Offence[],
  pncOffences: PncOffence[],
  applyMultipleCourtCaseMatchingLogic: boolean
): OffenceMatcherOutcome => {
  const outcome: OffenceMatcherOutcome = {
    allPncOffencesMatched: true,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }

  if (!hoOffences || !pncOffences || hoOffences.length === 0 || pncOffences.length === 0) {
    return outcome
  }

  const hoOffencesByEndDate = getHoOffencesByEndDate(hoOffences)
  const pncOffencesByEndDate = getPncOffencesByEndDate(pncOffences)
  const endDates = new Set(Object.keys(hoOffencesByEndDate).concat(Object.keys(pncOffencesByEndDate)))

  endDates.forEach((endDate) => {
    const hoOffencesForEndDate = hoOffencesByEndDate[endDate]?.filter(
      (hoOffence) => !hoOffenceAlreadyMatched(hoOffence, outcome)
    )
    const pncOffencesForEndDate = pncOffencesByEndDate[endDate]?.filter(
      (pncOffence) => !pncOffenceAlreadyMatched(pncOffence, outcome)
    )

    if (
      hoOffencesForEndDate &&
      pncOffencesForEndDate &&
      hoOffencesForEndDate.length !== 0 &&
      pncOffencesForEndDate.length !== 0
    ) {
      if (hoOffencesForEndDate.length > 1 && !offencesHaveEqualResults(hoOffencesForEndDate)) {
        outcome.duplicateHoOffences = outcome.duplicateHoOffences.concat(hoOffencesForEndDate)
        outcome.pncOffencesMatchedIncludingDuplicates =
          outcome.pncOffencesMatchedIncludingDuplicates.concat(pncOffencesForEndDate)
      } else if (applyMultipleCourtCaseMatchingLogic && hoOffencesForEndDate.length !== pncOffencesForEndDate.length) {
        outcome.duplicateHoOffences = outcome.duplicateHoOffences.concat(hoOffencesForEndDate)
        outcome.pncOffencesMatchedIncludingDuplicates =
          outcome.pncOffencesMatchedIncludingDuplicates.concat(pncOffencesForEndDate)
      } else {
        const minCount = Math.min(hoOffencesForEndDate.length, pncOffencesForEndDate.length)
        for (let i = 0; i < minCount; i++) {
          outcome.matchedOffences.push({ hoOffence: hoOffencesForEndDate[i], pncOffence: pncOffencesForEndDate[i] })
          outcome.pncOffencesMatchedIncludingDuplicates.push(pncOffencesForEndDate[i])
        }
      }
    }
  })

  return outcome
}

export default matchOffencesWithSameOffenceCodeAndStartDate
