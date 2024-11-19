import type CourtCase from "../../src/services/entities/CourtCase"

const createAuditLogRecord = (courtCase: CourtCase, createdBy = "Test Runner") => {
  const messageReceivedTimestamp = courtCase.messageReceivedTimestamp
  return {
    _: "_",
    caseId: courtCase.messageId,
    createdBy: createdBy,
    eventsCount: 0,
    externalCorrelationId: courtCase.messageId,
    isSanitised: 0,
    messageHash: courtCase.messageId,
    messageId: courtCase.messageId,
    pncStatus: "Processing",
    receivedDate:
      typeof messageReceivedTimestamp === "string" ? messageReceivedTimestamp : messageReceivedTimestamp.toISOString(),
    status: "Processing",
    triggerStatus: courtCase.triggerCount ? "Generated" : "NoTriggers",
    version: 2
  }
}

export default createAuditLogRecord
