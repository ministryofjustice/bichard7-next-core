import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import CoreAuditLogger from "./CoreAuditLogger"

describe("CoreAuditLogger", () => {
  const testEvent: AuditLogEvent = {
    timestamp: new Date(),
    eventType: "Test Event Type",
    eventCode: EventCode.ExceptionsGenerated,
    eventSourceQueueName: "DUMMY_QUEUE",
    eventSource: "Dummy Event Source",
    category: EventCategory.information
  }

  it("should store and retrieve the logs", () => {
    const auditLogger = new CoreAuditLogger()
    expect(auditLogger.getEvents()).toHaveLength(0)
    auditLogger.logEvent(testEvent)
    expect(auditLogger.getEvents()).toStrictEqual([testEvent])
  })
})
