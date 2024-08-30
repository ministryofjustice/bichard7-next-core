import CourtCase from "../../src/services/entities/CourtCase"

const createAuditLogRecord = (courtCase: CourtCase, createdBy = "Test Runner") => ({
  triggerStatus: courtCase.triggerCount ? "Generated" : "NoTriggers",
  messageId: courtCase.messageId,
  version: 2,
  isSanitised: 0,
  createdBy: createdBy,
  externalCorrelationId: courtCase.messageId,
  caseId: courtCase.messageId,
  messageHash: courtCase.messageId,
  pncStatus: "Processing",
  eventsCount: 0,
  receivedDate: courtCase.messageReceivedTimestamp.toISOString(),
  _: "_",
  status: "Processing"
})

export default createAuditLogRecord
