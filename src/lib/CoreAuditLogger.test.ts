import type EventCategory from "src/types/EventCategory"
import CoreAuditLogger from "./CoreAuditLogger"

describe("CoreAuditLogger", () => {
  const testEvent = {
    timestamp: new Date(),
    eventType: "Test Event Type",
    eventSourceArn: "Dummy source arn",
    eventSourceQueueName: "DUMMY_QUEUE",
    eventSource: "Dummy Event Source",
    category: "information" as EventCategory
  }

  it("should clear previous logs and log the start event", () => {
    const auditLogger = new CoreAuditLogger()
      .start("Test 1")
      .logEvent({
        ...testEvent,
        eventType: "Dummy event to be removed 1"
      })
      .logEvent({
        ...testEvent,
        category: "information"
      })
      .finish()

    auditLogger.start("Test 2").finish()

    const events = auditLogger.getEvents()
    expect(events).toHaveLength(2)
    expect(events[0].eventType).toBe("Started Test 2")
    expect(events[1].eventType).toBe("Finished Test 2")
  })

  it("should log the finish event", () => {
    const auditLogger = new CoreAuditLogger()
    auditLogger.start("Test 3")
    auditLogger
      .logEvent({
        ...testEvent,
        eventType: "Event 1"
      })
      .logEvent({
        ...testEvent,
        eventType: "Event 2"
      })
    auditLogger.finish()

    const events = auditLogger.getEvents()
    expect(events).toHaveLength(4)
    expect(events[0].eventType).toBe("Started Test 3")
    expect(events[1].eventType).toBe("Event 1")
    expect(events[2].eventType).toBe("Event 2")
    expect(events[3].eventType).toBe("Finished Test 3")
  })

  it("should not be able to log if logger is not started", () => {
    const auditLogger = new CoreAuditLogger()
    const log = () => auditLogger.logEvent({ ...testEvent, eventType: "To be removed 1" })

    expect(log).toThrow("Logger is not started")
  })

  it("should not be able to finish if logger is not started", () => {
    const auditLogger = new CoreAuditLogger()
    const log = () => auditLogger.finish()

    expect(log).toThrow("Logger is not started")
  })

  it("should not be able to start if already started", () => {
    const auditLogger = new CoreAuditLogger()
    auditLogger.start("Test 4")
    const log = () => auditLogger.start("Test 5")

    expect(log).toThrow("Logger is already started")
  })
})
