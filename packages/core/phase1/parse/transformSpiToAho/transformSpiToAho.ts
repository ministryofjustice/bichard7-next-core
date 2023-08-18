import type { IncomingMessageParsedXml } from "phase1/types/SpiResult"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

export default (spiResult: IncomingMessageParsedXml): AnnotatedHearingOutcome => ({
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: populateHearing(
        spiResult.DeliverRequest.MessageIdentifier,
        spiResult.DeliverRequest.Message.ResultedCaseMessage
      ),
      Case: populateCase(spiResult.DeliverRequest.Message.ResultedCaseMessage)
    }
  },
  Exceptions: []
})
