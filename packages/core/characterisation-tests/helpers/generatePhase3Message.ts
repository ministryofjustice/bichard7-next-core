import { PncOperation } from "../../types/PncOperation"
import MessageType from "../types/MessageType"
import generateMessage from "./generateMessage"

const generatePhase3Message = (): string => {
  return generateMessage("test-data/Phase2Message.xml.njk", {
    messageType: MessageType.PNC_UPDATE_DATASET,
    offences: [{ offenceReasonSequence: true, courtCaseReferenceNumber: true, results: [{}] }],
    normalDisposalOperation: {
      code: PncOperation.NORMAL_DISPOSAL,
      data: { courtCaseReference: true },
      status: "NotAttempted"
    }
  })
}

export default generatePhase3Message
