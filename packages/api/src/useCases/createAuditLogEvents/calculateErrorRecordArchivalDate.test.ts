import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"
import calculateErrorRecordArchivalDate from "./calculateErrorRecordArchivalDate"

const archivalTime = new Date().toISOString()

const archivalEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {},
    eventCode: EventCode.ErrorRecordArchived,
    timestamp: archivalTime
  } as DynamoAuditLogEvent
}

const nonArchivalEvent = (): DynamoAuditLogEvent => {
  return {
    attributes: {},
    eventType: "Something else"
  } as DynamoAuditLogEvent
}

describe("calculateErrorRecordArchivalDate", () => {
  it("should set archived status when an archival event is added", () => {
    const events = [nonArchivalEvent(), nonArchivalEvent(), archivalEvent(), nonArchivalEvent()]
    const forceOwnerDynamoUpdates = calculateErrorRecordArchivalDate(events)
    expect(forceOwnerDynamoUpdates).toStrictEqual({ errorRecordArchivalDate: archivalTime })
  })

  it("shouldn't change anything in dynamodb when there are no archival events", () => {
    const events = [nonArchivalEvent(), nonArchivalEvent(), nonArchivalEvent()]
    const forceOwnerDynamoUpdates = calculateErrorRecordArchivalDate(events)
    expect(forceOwnerDynamoUpdates).toStrictEqual({})
  })
})
