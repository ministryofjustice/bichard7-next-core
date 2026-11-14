import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { GenderCode } from "@moj-bichard7/standing-data/types/GenderCode"

import { GenderCodes } from "@moj-bichard7/standing-data/types/GenderCode"

export const gender = (aho: AnnotatedHearingOutcome) => {
  const genderValue = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.Gender

  if (genderValue !== undefined && genderValue in GenderCodes) {
    const description = GenderCodes[genderValue as GenderCode]

    return description.charAt(0).toUpperCase() + description.slice(1)
  }

  return "Unavailable"
}
