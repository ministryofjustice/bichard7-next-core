import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { formatDate } from "./formatDate"

export const dateOfBirth = (aho: AnnotatedHearingOutcome): string => {
  const dob = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate

  return formatDate(dob)
}
