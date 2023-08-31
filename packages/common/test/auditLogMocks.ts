import { v4 as uuid } from "uuid"
import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { InputApiAuditLog, OutputApiAuditLog } from "../types/AuditLogRecord"
import AuditLogStatus from "../types/AuditLogStatus"
import type EventCategory from "../types/EventCategory"
import PncStatus from "../types/PncStatus"
import TriggerStatus from "../types/TriggerStatus"

export const mockApiAuditLogEvent = (overrides: Partial<AuditLogEvent> = {}): AuditLogEvent => ({
  category: "information" as EventCategory,
  timestamp: new Date().toISOString(),
  eventCode: "dummy.event.code",
  eventType: "Test event",
  eventSource: "Test",
  eventSourceQueueName: "Test event source queue name",
  attributes: {
    "Attribute 1": "Attribute 1 data".repeat(500),
    "Attribute 2": "Attribute 2 data"
  },
  ...overrides
})

export const mockInputApiAuditLog = (overrides: Partial<InputApiAuditLog> = {}): InputApiAuditLog => ({
  caseId: "Case ID",
  createdBy: "Create audit log test",
  externalCorrelationId: uuid(),
  externalId: uuid(),
  isSanitised: 0,
  messageHash: uuid(),
  messageId: uuid(),
  nextSanitiseCheck: new Date().toISOString(),
  receivedDate: new Date().toISOString(),
  s3Path: "2022/01/18/09/01/message.xml",
  stepExecutionId: uuid(),
  systemId: "System",
  ...overrides
})

export const mockOutputApiAuditLog = (overrides: Partial<OutputApiAuditLog> = {}): OutputApiAuditLog => ({
  ...mockInputApiAuditLog(overrides),
  pncStatus: PncStatus.Processing,
  triggerStatus: TriggerStatus.NoTriggers,
  status: AuditLogStatus.processing,
  events: [],
  ...overrides
})
