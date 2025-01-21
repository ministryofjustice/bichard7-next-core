import type { ApiAuditLogEvent, DynamoAuditLogEvent } from "./AuditLogEvent"
import type AuditLogStatus from "./AuditLogStatus"

export type DynamoAuditLog = Omit<OutputApiAuditLog, "events"> & {
  errorRecordArchivalDate?: string
  events: DynamoAuditLogEvent[]
  eventsCount: number
  expiryTime?: string
  retryCount?: number
  version: number
}

export type InputApiAuditLog = {
  caseId: string
  createdBy: string
  externalCorrelationId: string
  externalId?: string
  isSanitised: number // TODO: Move into the Dynamo type and make the tests use the Gateway instead of the API
  messageHash: string
  messageId: string //TODO: Move into the Output type and make the create handler return the ID
  nextSanitiseCheck?: string // TODO: Move into the Dynamo type and make the tests use the Gateway instead of the API
  receivedDate: string
  s3Path?: string
  status?: AuditLogStatus
  stepExecutionId?: string
  systemId?: string
}

export type OutputApiAuditLog = InputApiAuditLog & {
  events: ApiAuditLogEvent[]
  forceOwner?: number
  pncStatus: string
  triggerStatus: string
}
