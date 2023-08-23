import EventCategory from "phase1/types/EventCategory"
import CoreAuditLogger from "lib/CoreAuditLogger"

describe("CoreAuditLogger", () => {
  const testEvent = {
    timestamp: new Date().toISOString(),
    eventType: "Test Event Type",
    eventCode: "dummy.code",
    eventSourceArn: "Dummy source arn",
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
