import type { IncomingMessageParsedXml } from "phase1/types/SpiResult"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import populateCase from "phase1/parse/transformSpiToAho/populateCase"
import populateHearing from "phase1/parse/transformSpiToAho/populateHearing"

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
