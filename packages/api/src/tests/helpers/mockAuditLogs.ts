import { randomUUID } from "crypto"

import type { DynamoAuditLog, InputApiAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type { ApiAuditLogEvent, DynamoAuditLogEvent, DynamoAuditLogUserEvent } from "../../types/AuditLogEvent"
import type EventCategory from "../../types/EventCategory"

import AuditLogStatus from "../../types/AuditLogStatus"
import PncStatus from "../../types/PncStatus"
import TriggerStatus from "../../types/TriggerStatus"

export const mockInputApiAuditLog = (overrides: Partial<InputApiAuditLog> = {}): InputApiAuditLog => ({
  caseId: "Case ID",
  createdBy: "Create audit log test",
  externalCorrelationId: randomUUID(),
  externalId: randomUUID(),
  isSanitised: 0,
  messageHash: randomUUID(),
  messageId: randomUUID(),
  nextSanitiseCheck: new Date().toISOString(),
  receivedDate: new Date().toISOString(),
  s3Path: "2022/01/18/09/01/message.xml",
  stepExecutionId: randomUUID(),
  systemId: "System",
  ...overrides
})

export const mockOutputApiAuditLog = (overrides: Partial<OutputApiAuditLog> = {}): OutputApiAuditLog => ({
  ...mockInputApiAuditLog(overrides),
  events: [],
  pncStatus: PncStatus.Processing,
  status: AuditLogStatus.processing,
  triggerStatus: TriggerStatus.NoTriggers,
  ...overrides
})

export const mockDynamoAuditLog = (overrides: Partial<DynamoAuditLog> = {}): DynamoAuditLog => ({
  ...mockOutputApiAuditLog(overrides),
  events: [],
  eventsCount: 0,
  isSanitised: 0,
  version: 0,
  ...overrides
})

export const mockApiAuditLogEvent = (overrides: Partial<ApiAuditLogEvent> = {}): ApiAuditLogEvent => ({
  attributes: {
    "Attribute 1": "Attribute 1 data".repeat(500),
    "Attribute 2": "Attribute 2 data"
  },
  category: "information" as EventCategory,
  eventCode: "dummy.event.code",
  eventSource: "Test",
  eventSourceQueueName: "Test event source queue name",
  eventType: "Test event",
  eventXml: "Test event xml".repeat(500),
  timestamp: new Date().toISOString(),
  ...overrides
})

export const mockDynamoAuditLogEvent = (
  overrides: Partial<DynamoAuditLogEvent & { _id?: string }> = {}
): DynamoAuditLogEvent => ({
  ...mockApiAuditLogEvent(overrides),
  _automationReport: 0,
  _messageId: "needs-setting",
  _topExceptionsReport: 0,
  ...overrides
})

export const mockDynamoAuditLogUserEvent = (overrides: Partial<DynamoAuditLogEvent> = {}): DynamoAuditLogUserEvent => ({
  ...mockApiAuditLogEvent(overrides),
  _automationReport: 0,
  _topExceptionsReport: 0,
  user: "needs-string",
  ...overrides
})
