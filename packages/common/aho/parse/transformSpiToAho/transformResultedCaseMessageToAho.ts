import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "../../../types/SpiResult"

import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

const transformResultedCaseMessageToAho = (
  message: ResultedCaseMessageParsedXml,
  correlationId: string
): AnnotatedHearingOutcome => ({
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Case: populateCase(message),
      Hearing: populateHearing(correlationId, message)
    }
  },
  Exceptions: []
})

export default transformResultedCaseMessageToAho
