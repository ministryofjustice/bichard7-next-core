import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import parseMessage from "./parseMessage"
import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

export default (messageXml: string): AnnotatedHearingOutcome => {
  // Parse Court Result
  const courtResult = parseMessage(messageXml)
  const messageId = "Dummy"

  return {
    HearingOutcome: {
      Hearing: populateHearing(messageId, courtResult),
      Case: populateCase(courtResult)
    }
  }
}
