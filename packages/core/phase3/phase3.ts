import type AuditLogger from "../types/AuditLogger"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"
import { Phase3ResultType } from "./types/Phase3Result"

const phase3 = (inputMessage: PncUpdateDataset, auditLogger: AuditLogger): Phase3Result => {
  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId: "",
    outputMessage: inputMessage,
    pncOperations: [],
    triggers: [],
    triggerGenerationAttempted: false,
    resultType: Phase3ResultType.success
  }
}

export default phase3
