import type { Amendments } from "@moj-bichard7/common/types/Amendments"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { ValidProperties } from "@moj-bichard7/common/types/Amendments"

import amendDefendantOrOffenceResult from "./amendDefendantOrOffenceResult"

const amendResultVariableText = (offences: Amendments["resultVariableText"], aho: AnnotatedHearingOutcome) =>
  offences?.forEach(({ offenceIndex, resultIndex, value }) => {
    if (!value) {
      return
    }

    amendDefendantOrOffenceResult(offenceIndex, resultIndex, aho, ValidProperties.ResultVariableText, value)
  })

export default amendResultVariableText
