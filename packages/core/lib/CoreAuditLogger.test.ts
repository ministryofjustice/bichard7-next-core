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

  it("should log an info level log", () => {
    const attributes = { foo: "bar" }
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
})
