import { mockApiAuditLogEvent } from "../../tests/helpers/mockAuditLogs"
import calculateAuditLogEventIndices from "./calculateAuditLogEventIndices"

describe("calculateAuditLogEventIndices", () => {
  it("should mark the record as being for the automation report if required", () => {
    const event = mockApiAuditLogEvent({ eventCode: "exceptions.generated" })
    const result = calculateAuditLogEventIndices(event)
    expect(result._automationReport).toBe(1)
  })

  it("should not mark the record as being for the automation report if not required", () => {
    const event = mockApiAuditLogEvent({ eventCode: "exeptions.not.generated" })
    const result = calculateAuditLogEventIndices(event)
    expect(result._automationReport).toBe(0)
  })

  it("should mark the record as being for the top exception report if required", () => {
    const event = mockApiAuditLogEvent({ eventCode: "exceptions.generated" })
    const result = calculateAuditLogEventIndices(event)
    expect(result._topExceptionsReport).toBe(1)
  })

  it("should not mark the record as being for the top exception report if not required", () => {
    const event = mockApiAuditLogEvent()
    const result = calculateAuditLogEventIndices(event)
    expect(result._topExceptionsReport).toBe(0)
  })
})
