import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { MockServer } from "jest-mock-server"

import type Phase1Result from "../../phase1/types/Phase1Result"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import storeAuditLogEvents from "./storeAuditLogEvents"

const dummyAuditLogEvent = {
  category: EventCategory.error,
  eventCode: EventCode.AllTriggersResolved,
  eventSource: "Test",
  eventType: "Type",
  timestamp: new Date()
}

const invalidAuditLogEvent = {
  category: EventCategory.error,
  eventCode: EventCode.AllTriggersResolved,
  eventType: "Type",
  timestamp: new Date()
}

describe("storeAuditLogEvents", () => {
  let auditLogApi: MockServer

  beforeAll(async () => {
    process.env.AUDIT_LOG_API_URL = "http://localhost:11001"
    process.env.AUDIT_LOG_API_KEY = "dummy"

    auditLogApi = new MockServer({ port: 11001 })
    await auditLogApi.start()
  })

  it("should store multiple events in a single call to the API", async () => {
    const phase1Result: Phase1Result = {
      auditLogEvents: [
        {
          category: EventCategory.information,
          eventCode: EventCode.AllTriggersResolved,
          eventSource: "Test",
          eventType: "Type",
          timestamp: new Date()
        },
        {
          category: EventCategory.error,
          eventCode: EventCode.DuplicateMessage,
          eventSource: "Test2",
          eventType: "Type2",
          timestamp: new Date()
        }
      ],
      correlationId: "dummy-id",
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success,
      triggers: []
    }
    const mockApiCall = auditLogApi
      .post(`/messages/${phase1Result.correlationId}/events`)
      .mockImplementationOnce((ctx) => {
        ctx.status = 204
      })

    await storeAuditLogEvents.execute({
      inputData: { auditLogEvents: phase1Result.auditLogEvents, correlationId: phase1Result.correlationId }
    })
    expect(mockApiCall).toHaveBeenCalledTimes(1)
    const expectedAuditLogEvents = phase1Result.auditLogEvents.map((e) => ({
      ...e,
      timestamp: e.timestamp.toISOString()
    }))
    expect(mockApiCall.mock.calls[0][0].request).toHaveProperty("body", expectedAuditLogEvents)
  })

  it("should return FAILED if it fails to write to the audit log", async () => {
    const phase1Result: Phase1Result = {
      auditLogEvents: [dummyAuditLogEvent],
      correlationId: "dummy-id",
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success,
      triggers: []
    }
    auditLogApi.post(`/messages/${phase1Result.correlationId}/events`).mockImplementationOnce((ctx) => {
      ctx.status = 500
    })

    const result = await storeAuditLogEvents.execute({
      inputData: { auditLogEvents: phase1Result.auditLogEvents, correlationId: phase1Result.correlationId }
    })

    expect(result.status).toBe("FAILED")
  })

  it("should fail with terminal error if the correlation id is missing", async () => {
    const result = await storeAuditLogEvents.execute({
      inputData: { auditLogEvents: [dummyAuditLogEvent] }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for correlationId")
  })

  it("should fail with terminal error if the audit logs are missing", async () => {
    const result = await storeAuditLogEvents.execute({ inputData: { correlationId: "foo" } })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected array for auditLogEvents")
  })

  it("should fail with terminal error if the audit logs are invalid", async () => {
    const result = await storeAuditLogEvents.execute({
      inputData: { auditLogEvents: [invalidAuditLogEvent], correlationId: "foo" }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "InputData error: Expected string for auditLogEvents.0.eventSource"
    )
  })
})
