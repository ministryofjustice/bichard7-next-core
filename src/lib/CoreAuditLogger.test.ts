import CoreAuditLogger from "./CoreAuditLogger"

describe("CoreAuditLogger", () => {
  it("should clear previous logs and log the start event", () => {
    const auditLogger = new CoreAuditLogger()
      .start("Test 1")
      .logEvent("To be removed 1")
      .logEvent("To be removed 2")
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
    auditLogger.logEvent("Event 1").logEvent("Event 2")
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
    const log = () => auditLogger.logEvent("To be removed 1")

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
