import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

import shouldLogForTopExceptionsReport from "./shouldLogForTopExceptionsReport"

it("should return true when event has correct event code attribute", () => {
  const event = {
    attributes: {
      "Error 1 Details": "Dummy"
    },
    eventCode: "exceptions.generated"
  } as unknown as ApiAuditLogEvent

  const result = shouldLogForTopExceptionsReport(event)

  expect(result).toBe(true)
})

it("should return false when event has incorrect event code attribute", () => {
  const event = {
    eventCode: "dummy"
  } as unknown as ApiAuditLogEvent

  const result = shouldLogForTopExceptionsReport(event)

  expect(result).toBe(false)
})
