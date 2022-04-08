import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"

const getHoOffencesByEndDate = (hoOffences: Offence[]) =>
  hoOffences.reduce((acc: { [key: string]: Offence[] }, hoOffence) => {
    const endDate = hoOffence.ActualOffenceEndDate?.EndDate.toISOString()

    if (!endDate) {
      return acc
    }

    if (!acc[endDate]) {
      acc[endDate] = []
    }

    acc[endDate].push(hoOffence)

    return acc
  }, {})

const getPncOffencesByEndDate = (pncOffences: PncOffence[]) =>
  pncOffences.reduce((acc: { [key: string]: PncOffence[] }, pncOffence) => {
    const endDate = pncOffence.offence.endDate?.toISOString()

    if (!endDate) {
      return acc
    }

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
) => {
  if (hoOffences.length === 0 || pncOffences.length === 0) {
    return
  }

  const hoOffencesByEndDate = getHoOffencesByEndDate(hoOffences)
  const pncOffencesByEndDate = getPncOffencesByEndDate(pncOffences)
  const endDates = new Set(Object.keys(hoOffencesByEndDate).concat(Object.keys(pncOffencesByEndDate)))

  endDates.forEach((endDate) => {
    const hoOffencesForEndDate = hoOffencesByEndDate[endDate]
    const pncOffencesForEndDate = pncOffencesByEndDate[endDate]

    const matchingPncOffences: PncOffence[] = []

    if (pncOffencesForEndDate.length !== 0) {
      matchingPncOffences.concat(pncOffencesForDate)
      // Continue here
    }
  })
}

export default matchOffencesWithSameOffenceCodeAndStartDate
