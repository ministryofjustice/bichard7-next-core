import type CourtCase from "../../src/services/entities/CourtCase"

const createAuditLogRecord = (courtCase: CourtCase, createdBy = "Test Runner") => {
  const messageReceivedTimestamp = courtCase.messageReceivedTimestamp
  return {
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
    receivedDate:
      typeof messageReceivedTimestamp === "string" ? messageReceivedTimestamp : messageReceivedTimestamp.toISOString(),
    _: "_",
    status: "Processing"
  }
}

export default createAuditLogRecord
