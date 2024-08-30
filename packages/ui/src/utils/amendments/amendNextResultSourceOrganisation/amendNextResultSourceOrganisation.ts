import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"
import { Amendments, ValidProperties } from "types/Amendments"

const amendNextResultSourceOrganisation = (
  offences: Amendments["nextSourceOrganisation"],
  aho: AnnotatedHearingOutcome
) => {
  offences?.forEach(({ value, resultIndex, offenceIndex }) => {
    if (value === undefined) {
      return
    }

    const amendedSourceOrganisation = {
      ...(value.length >= 1 && { TopLevelCode: value.substring(0, 1) }),
      SecondLevelCode: value.length >= 3 ? value.substring(1, 3) : null,
      ThirdLevelCode: value.length >= 5 ? value.substring(3, 5) : null,
      BottomLevelCode: value.length >= 6 ? value.substring(5, 6) : null,
      OrganisationUnitCode: value
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
