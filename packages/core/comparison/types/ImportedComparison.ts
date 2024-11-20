import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

export type ImportedComparison = {
  annotatedHearingOutcome: string
  auditLogEvents?: string[]
  dbContent?: { errorList: ErrorListRecord[]; errorListTriggers: ErrorListTriggerRecord[] }
  file?: string
  incomingMessage: string
  standingDataVersion: string
  triggers: Trigger[]
}
