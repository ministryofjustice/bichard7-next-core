import type EventCategory from "@moj-bichard7/common/types/EventCategory"

import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import { randomUUID } from "crypto"

import type { DynamoAuditLog, InputApiAuditLog, InternalDynamoAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type { ApiAuditLogEvent, DynamoAuditLogEvent, DynamoAuditLogUserEvent } from "../../types/AuditLogEvent"

import PncStatus from "../../types/PncStatus"
import TriggerStatus from "../../types/TriggerStatus"

export const mockInputApiAuditLog = (overrides: Partial<InputApiAuditLog> = {}): InputApiAuditLog => ({
  caseId: "Case ID",
  createdBy: "Create audit log test",
  externalCorrelationId: randomUUID(),
  externalId: randomUUID(),
  messageHash: randomUUID(),
  messageId: randomUUID(),
  receivedDate: new Date().toISOString(),
  s3Path: "2022/01/18/09/01/message.xml",
  systemId: "System",
  ...overrides
})

export const mockOutputApiAuditLog = (overrides: Partial<OutputApiAuditLog> = {}): OutputApiAuditLog => ({
  ...mockInputApiAuditLog(overrides),
  events: [],
  pncStatus: PncStatus.Processing,
  status: AuditLogStatus.Processing,
  triggerStatus: TriggerStatus.NoTriggers,
  ...overrides
})

export const mockDynamoAuditLog = (overrides: Partial<DynamoAuditLog> = {}): DynamoAuditLog => ({
  ...mockInternalDynamoAuditLog(overrides),
  events: []
})

export const mockInternalDynamoAuditLog = (overrides: Partial<DynamoAuditLog> = {}): InternalDynamoAuditLog => ({
  ...mockInputApiAuditLog(overrides),
  eventsCount: 0,
  isSanitised: 0,
  nextSanitiseCheck: new Date().toISOString(),
  pncStatus: PncStatus.Processing,
  status: overrides.status ?? AuditLogStatus.Processing,
  triggerStatus: TriggerStatus.NoTriggers,
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

export const mockDynamoAuditLogEvent = (overrides: Partial<DynamoAuditLogEvent> = {}): DynamoAuditLogEvent => ({
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
