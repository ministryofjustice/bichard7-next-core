import type MessageType from "core/phase1/src/types/MessageType"

const getMessageType = (message: string): MessageType | undefined => {
  if (message.match(/ResultedCaseMessage/)) {
    return "SPIResults"
  } else if (message.match(/<br7:HearingOutcome/) || message.match(/<br7:AnnotatedHearingOutcome/)) {
    return "HearingOutcome"
  }
}

export default getMessageType
