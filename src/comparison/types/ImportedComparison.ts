import type AuditLogEvent from "src/types/AuditLogEvent"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "src/types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

export type ImportedComparison = {
  file?: string
  incomingMessage: string
  annotatedHearingOutcome: string
  standingDataVersion: string
  triggers: Trigger[]
  dbContent?: { errorList: ErrorListRecord[]; errorListTriggers: ErrorListTriggerRecord[] }
  auditLogs?: AuditLogEvent[]
}
