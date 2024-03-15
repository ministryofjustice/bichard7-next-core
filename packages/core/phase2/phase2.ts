import type { AnnotatedPNCUpdateDataset } from "../types/AnnotatedPNCUpdateDataset"
import type AuditLogger from "../phase1/types/AuditLogger"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"

const phase2 = (
  incomingMessage: AnnotatedHearingOutcome | AnnotatedPNCUpdateDataset,
  auditLogger: AuditLogger
): Phase2Result => {
  console.log(!!incomingMessage, !!auditLogger)
  return {
    auditLogEvents: [],
    correlationId: "correlationId",
    outputMessage: {} as unknown as AnnotatedPNCUpdateDataset,
    triggers: [],
    resultType: Phase2ResultType.success
  }
}
export default phase2
