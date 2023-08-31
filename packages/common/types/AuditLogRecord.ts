import type { AuditLogEvent } from "./AuditLogEvent"
import type AuditLogStatus from "./AuditLogStatus"

export type InputApiAuditLog = {
  caseId: string
  createdBy: string
  externalId?: string
  externalCorrelationId: string
  isSanitised: number
  messageHash: string
  messageId: string
  nextSanitiseCheck?: string
  receivedDate: string
  s3Path?: string
  stepExecutionId?: string
  systemId?: string
}

export type OutputApiAuditLog = InputApiAuditLog & {
  events: AuditLogEvent[]
  forceOwner?: number
  pncStatus: string
  status: AuditLogStatus
  triggerStatus: string
}
