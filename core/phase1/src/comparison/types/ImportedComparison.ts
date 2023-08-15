import type ErrorListRecord from "core/phase1/src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "core/phase1/src/types/ErrorListTriggerRecord"
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
