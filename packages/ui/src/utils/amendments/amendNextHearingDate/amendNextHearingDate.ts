import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments, ValidProperties } from "types/Amendments"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"

const amendNextHearingDate = (amendments: Amendments["nextHearingDate"], aho: AnnotatedHearingOutcome) =>
  amendments?.forEach(({ offenceIndex, resultIndex, value }) => {
    if (!value) {
      return
    }

    amendDefendantOrOffenceResult(offenceIndex, resultIndex, aho, ValidProperties.NextHearingDate, value)
  })

export default amendNextHearingDate
