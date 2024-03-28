import type MessageType from "../../types/MessageType"

const getMessageType = (message: string): MessageType | undefined => {
  if (message.match(/ResultedCaseMessage/)) {
    return "SPIResults"
  } else if (message.match(/<br7:HearingOutcome/) || message.match(/<br7:AnnotatedHearingOutcome/)) {
    if (message.match(/AnnotatedPNCUpdateDataset/)) {
      return "AnnotatedPNCUpdateDataset"
    } else if (message.match(/PNCUpdateDataset/)) {
      return "PncUpdateDataset"
    }
    return "AnnotatedHearingOutcome"
  }
}

export default getMessageType
