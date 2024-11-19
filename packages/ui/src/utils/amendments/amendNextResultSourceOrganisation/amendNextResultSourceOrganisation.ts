import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

import { ValidProperties } from "types/Amendments"

import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendNextResultSourceOrganisation = (
  offences: Amendments["nextSourceOrganisation"],
  aho: AnnotatedHearingOutcome
) => {
  offences?.forEach(({ offenceIndex, resultIndex, value }) => {
    if (value === undefined) {
      return
    }

    const amendedSourceOrganisation = {
      ...(value.length >= 1 && { TopLevelCode: value.substring(0, 1) }),
      BottomLevelCode: value.length >= 6 ? value.substring(5, 6) : null,
      OrganisationUnitCode: value,
      SecondLevelCode: value.length >= 3 ? value.substring(1, 3) : null,
      ThirdLevelCode: value.length >= 5 ? value.substring(3, 5) : null
    }

    return amendDefendantOrOffenceResult(
      offenceIndex,
      resultIndex,
      aho,
      ValidProperties.NextResultSourceOrganisation,
      amendedSourceOrganisation
    )
  })
}

export default amendNextResultSourceOrganisation
