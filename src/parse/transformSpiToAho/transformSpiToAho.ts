import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { IncomingMessageParsedXml } from "src/types/SpiResult"
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
  }
})
