import type EventCategory from "src/types/EventCategory"
import CoreAuditLogger from "./CoreAuditLogger"

describe("CoreAuditLogger", () => {
  const testEvent = {
    timestamp: new Date().toISOString(),
    eventType: "Test Event Type",
    eventCode: "dummy.code",
    eventSourceArn: "Dummy source arn",
    eventSourceQueueName: "DUMMY_QUEUE",
    eventSource: "Dummy Event Source",
    category: "information" as EventCategory
  }

  it("should store and retrieve the logs", () => {
    const auditLogger = new CoreAuditLogger()
    expect(auditLogger.getEvents()).toHaveLength(0)
    auditLogger.logEvent(testEvent)
    expect(auditLogger.getEvents()).toStrictEqual([testEvent])
  })
})
