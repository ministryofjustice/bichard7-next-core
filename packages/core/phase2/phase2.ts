import type AuditLogger from "../phase1/types/AuditLogger"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"

const phase2 = (
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  _auditLogger: AuditLogger
): Phase2Result => {
  const outputMessage = structuredClone(incomingMessage) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations || []

  return {
    auditLogEvents: [],
    correlationId: "correlationId",
    outputMessage,
    triggers: [],
    resultType: Phase2ResultType.success
  }
}
export default phase2
