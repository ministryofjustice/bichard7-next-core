import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import offenceIsBreach from "./offenceIsBreach"
import type { OffenceMatcherOutcome } from "./offenceMatcher"
import { getHoOffencesByOffenceCode, getPncOffencesByOffenceCode, pncOffenceAlreadyMatched } from "./offenceMatcher"
import { offencesHaveEqualResults } from "./resultsAreEqual"

const matchUnmatchedBreachesWithoutUsingDates = (
  outcome: OffenceMatcherOutcome,
  hoOffences: Offence[],
  pncOffences: PncOffence[],
  applyMultipleCourtCaseMatchingLogic: boolean
): OffenceMatcherOutcome => {
  const answer: OffenceMatcherOutcome = {
    allPncOffencesMatched: false,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }

  const breachHoOffences = hoOffences.filter((hoOffence) => offenceIsBreach(hoOffence))
  const hoOffencesByCode = getHoOffencesByOffenceCode(breachHoOffences)

  const unmatchedPncOffences = pncOffences.filter((pncOffence) => !pncOffenceAlreadyMatched(pncOffence, outcome))

  const pncOffencesByCode = getPncOffencesByOffenceCode(unmatchedPncOffences)

  const offenceCodes = new Set(Object.keys(hoOffencesByCode).concat(Object.keys(pncOffencesByCode)))

  offenceCodes.forEach((offenceCode) => {
    const hoOffencesForCode = hoOffencesByCode[offenceCode]
    const pncOffencesForCode = pncOffencesByCode[offenceCode]

    if (!pncOffencesForCode || !hoOffencesForCode) {
      return
    }

    if (hoOffencesForCode.length === 1 && pncOffencesForCode.length === 1) {
      outcome.matchedOffences.push({ hoOffence: hoOffencesForCode[0], pncOffence: pncOffencesForCode[0] })
      outcome.pncOffencesMatchedIncludingDuplicates.push(pncOffencesForCode[0])
    } else if (hoOffencesForCode.length > 1 && !offencesHaveEqualResults(hoOffencesForCode)) {
      outcome.duplicateHoOffences = outcome.duplicateHoOffences.concat(hoOffencesForCode)
      outcome.pncOffencesMatchedIncludingDuplicates =
        outcome.pncOffencesMatchedIncludingDuplicates.concat(pncOffencesForCode)
    } else if (applyMultipleCourtCaseMatchingLogic && hoOffencesForCode.length !== pncOffencesForCode.length) {
      outcome.duplicateHoOffences = outcome.duplicateHoOffences.concat(hoOffencesForCode)
      outcome.pncOffencesMatchedIncludingDuplicates =
        outcome.pncOffencesMatchedIncludingDuplicates.concat(pncOffencesForCode)
    } else {
      const minCount = Math.min(hoOffencesForCode.length, pncOffencesForCode.length)
      for (let i = 0; i < minCount; i++) {
        outcome.matchedOffences.push({ hoOffence: hoOffencesForCode[i], pncOffence: pncOffencesForCode[i] })
        outcome.pncOffencesMatchedIncludingDuplicates.push(pncOffencesForCode[i])
      }
    }
  })

  return answer
}

export default matchUnmatchedBreachesWithoutUsingDates
