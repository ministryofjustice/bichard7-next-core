import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

export const datesMatchExactly = (hoOffence: Offence, pncOffence: PoliceOffence): boolean => {
  if (hoOffence.ActualOffenceStartDate.StartDate.toISOString() !== pncOffence.offence.startDate.toISOString()) {
    return false
  }

  if (hoOffence.ActualOffenceEndDate?.EndDate === undefined && pncOffence.offence.endDate === undefined) {
    return true
  }

  if (hoOffence.ActualOffenceEndDate?.EndDate && pncOffence.offence.endDate) {
    return hoOffence.ActualOffenceEndDate.EndDate.toISOString() === pncOffence.offence.endDate.toISOString()
  }

  return false
}
