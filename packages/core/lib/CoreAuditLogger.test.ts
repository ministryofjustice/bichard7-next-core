import { AuditLogEventSource, auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../phase1/types/AuditLogger"
import CoreAuditLogger from "./CoreAuditLogger"

describe("CoreAuditLogger", () => {
  let auditLogger: AuditLogger

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    expect(auditLogger.getEvents()).toHaveLength(0)
  })

  it("should log info", () => {
    const attributes = { foo: "info" }
    auditLogger.info(EventCode.ExceptionsGenerated, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      eventCode: EventCode.ExceptionsGenerated,
      eventType: auditLogEventLookup[EventCode.ExceptionsGenerated],
      category: EventCategory.information,
      eventSource: AuditLogEventSource.CorePhase1,
      attributes,
      timestamp: expect.any(Date)
    })
  })

  it("should log errors", () => {
    const attributes = { foo: "error" }
    auditLogger.error(EventCode.MessageRejected, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      eventCode: EventCode.MessageRejected,
      eventType: auditLogEventLookup[EventCode.MessageRejected],
      category: EventCategory.error,
      eventSource: AuditLogEventSource.CorePhase1,
      attributes,
      timestamp: expect.any(Date)
    })
  })

  it("should log warnings", () => {
    const attributes = { foo: "warn" }
    auditLogger.warn(EventCode.DuplicateMessage, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      eventCode: EventCode.DuplicateMessage,
      eventType: auditLogEventLookup[EventCode.DuplicateMessage],
      category: EventCategory.warning,
      eventSource: AuditLogEventSource.CorePhase1,
      attributes,
      timestamp: expect.any(Date)
    })
  })

  it("should log debug info", () => {
    const attributes = { foo: "debug" }
    auditLogger.debug(EventCode.ExceptionsGenerated, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      eventCode: EventCode.ExceptionsGenerated,
      eventType: auditLogEventLookup[EventCode.ExceptionsGenerated],
      category: EventCategory.debug,
      eventSource: AuditLogEventSource.CorePhase1,
      attributes,
      timestamp: expect.any(Date)
    })
  })
})
