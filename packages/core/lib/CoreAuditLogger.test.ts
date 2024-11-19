import { auditLogEventLookup, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"

import type AuditLogger from "../types/AuditLogger"

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
      attributes,
      category: EventCategory.information,
      eventCode: EventCode.ExceptionsGenerated,
      eventSource: AuditLogEventSource.CorePhase1,
      eventType: auditLogEventLookup[EventCode.ExceptionsGenerated],
      timestamp: expect.any(Date)
    })
  })

  it("should log errors", () => {
    const attributes = { foo: "error" }
    auditLogger.error(EventCode.MessageRejected, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      attributes,
      category: EventCategory.error,
      eventCode: EventCode.MessageRejected,
      eventSource: AuditLogEventSource.CorePhase1,
      eventType: auditLogEventLookup[EventCode.MessageRejected],
      timestamp: expect.any(Date)
    })
  })

  it("should log warnings", () => {
    const attributes = { foo: "warn" }
    auditLogger.warn(EventCode.DuplicateMessage, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      attributes,
      category: EventCategory.warning,
      eventCode: EventCode.DuplicateMessage,
      eventSource: AuditLogEventSource.CorePhase1,
      eventType: auditLogEventLookup[EventCode.DuplicateMessage],
      timestamp: expect.any(Date)
    })
  })

  it("should log debug info", () => {
    const attributes = { foo: "debug" }
    auditLogger.debug(EventCode.ExceptionsGenerated, attributes)

    expect(auditLogger.getEvents()).toHaveLength(1)
    expect(auditLogger.getEvents()[0]).toStrictEqual({
      attributes,
      category: EventCategory.debug,
      eventCode: EventCode.ExceptionsGenerated,
      eventSource: AuditLogEventSource.CorePhase1,
      eventType: auditLogEventLookup[EventCode.ExceptionsGenerated],
      timestamp: expect.any(Date)
    })
  })
})
