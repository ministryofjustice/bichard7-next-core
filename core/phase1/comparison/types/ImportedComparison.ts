import type ErrorListRecord from "core/phase1/types/ErrorListRecord"
import type ErrorListTriggerRecord from "core/phase1/types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

export type ImportedComparison = {
  file?: string
  incomingMessage: string
  annotatedHearingOutcome: string
  standingDataVersion: string
  triggers: Trigger[]
  dbContent?: { errorList: ErrorListRecord[]; errorListTriggers: ErrorListTriggerRecord[] }
  auditLogEvents?: string[]
}
