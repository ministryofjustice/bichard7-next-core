import { randomUUID } from "crypto"
import type { AuditLogEvent } from "../types/AuditLogEvent"
import type { AuditLogApiRecordInput, AuditLogApiRecordOutput } from "../types/AuditLogRecord"
import AuditLogStatus from "../types/AuditLogStatus"
import type EventCategory from "../types/EventCategory"
import EventCode from "../types/EventCode"
import PncStatus from "../types/PncStatus"
import TriggerStatus from "../types/TriggerStatus"

export const mockApiAuditLogEvent = (overrides: Partial<AuditLogEvent> = {}): AuditLogEvent => ({
  category: "information" as EventCategory,
  timestamp: new Date(),
  eventCode: EventCode.PncResponseNotReceived,
  eventType: "Test event",
  eventSource: "Test",
  eventSourceQueueName: "Test event source queue name",
  attributes: {
    "Attribute 1": "Attribute 1 data".repeat(500),
    "Attribute 2": "Attribute 2 data"
  },
  ...overrides
})

export const mockAuditLogApiRecordInput = (
  overrides: Partial<AuditLogApiRecordInput> = {}
): AuditLogApiRecordInput => ({
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

export const mockAuditLogApiRecordOutput = (
  overrides: Partial<AuditLogApiRecordOutput> = {}
): AuditLogApiRecordOutput => ({
  ...mockAuditLogApiRecordInput(overrides),
  pncStatus: PncStatus.Processing,
  triggerStatus: TriggerStatus.NoTriggers,
  status: AuditLogStatus.processing,
  events: [],
  ...overrides
})
