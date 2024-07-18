import type { ResultedCaseMessageParsedXml } from "../../../phase1/types/SpiResult"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

const transformResultedCaseMessageToAho = (
  message: ResultedCaseMessageParsedXml,
  correlationId: string
): AnnotatedHearingOutcome => ({
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: populateHearing(correlationId, message),
      Case: populateCase(message)
    }
  },
  Exceptions: []
})

export default transformResultedCaseMessageToAho
