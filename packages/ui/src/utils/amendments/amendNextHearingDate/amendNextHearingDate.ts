import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"
import { ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendNextHearingDate = (amendments: Amendments["nextHearingDate"], aho: AnnotatedHearingOutcome) =>
  amendments?.forEach(({ offenceIndex, resultIndex, value }) => {
    if (!value) {
      return
    }

    amendDefendantOrOffenceResult(offenceIndex, resultIndex, aho, ValidProperties.NextHearingDate, value)
  })

export default amendNextHearingDate
