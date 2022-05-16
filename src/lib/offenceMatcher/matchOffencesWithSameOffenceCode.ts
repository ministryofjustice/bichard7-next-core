import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import matchOffencesWithSameOffenceCodeAndStartDate from "./matchOffencesWithSameOffenceCodeAndStartDate"

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
) => {
  if (hoOffences.length === 0 || pncOffences.length === 0) {
    return
  }

  const hoOffencesByStartDate = getHoOffencesByStartDate(hoOffences)
  const pncOffencesByStartDate = getPncOffencesByStartDate(pncOffences)
  const startDates = new Set(Object.keys(hoOffencesByStartDate).concat(Object.keys(pncOffencesByStartDate)))

  startDates.forEach((startDate) => {
    const outcome = matchOffencesWithSameOffenceCodeAndStartDate(
      hoOffencesByStartDate[startDate],
      pncOffencesByStartDate[startDate],
      applyMultipleCourtCaseMatchingLogic
    )
    console.log(outcome)
  })
}

export default matchOffencesWithSameOffenceCode
