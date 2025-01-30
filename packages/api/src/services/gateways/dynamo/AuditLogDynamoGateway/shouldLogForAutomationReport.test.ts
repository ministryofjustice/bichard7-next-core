import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

import shouldLogForAutomationReport, { automationReportEventCodes } from "./shouldLogForAutomationReport"

const automationReportEvents = automationReportEventCodes.map((eventCode) => ({ eventCode }) as ApiAuditLogEvent)

it.each(automationReportEvents)(
  "should return true when event type is an automation report event type: %s",
  (event) => {
    const result = shouldLogForAutomationReport(event)

    expect(result).toBe(true)
  }
)

it("should return false when event type is not one of the automation report event types", () => {
  const event = {
    eventType: "Invalid event type for automation report"
  } as ApiAuditLogEvent

  const result = shouldLogForAutomationReport(event)

  expect(result).toBe(false)
})
