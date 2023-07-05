jest.setTimeout(999999999)
process.env.AUDIT_LOG_API_URL = "http://localhost:11001"
process.env.AUDIT_LOG_API_KEY = "dummy"

import { MockServer } from "jest-mock-server"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import { Phase1ResultType } from "src/types/Phase1Result"
import storeAuditLogEvents from "./storeAuditLogEvents"
import EventCategory from "../../types/EventCategory"

describe("storeAuditLogEvents", () => {
  let auditLogApi: MockServer

  beforeAll(async () => {
    auditLogApi = new MockServer({ port: 11001 })
    await auditLogApi.start()
  })

  it("should store multiple events in a single call to the API", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [
        {
          eventCode: "dummyEventCode",
          eventSource: "Test",
          eventType: "Type",
          category: EventCategory.information,
          timestamp: new Date().toISOString()
        },
        {
          eventCode: "dummyEventCode2",
          eventSource: "Test2",
          eventType: "Type2",
          category: EventCategory.error,
          timestamp: new Date().toISOString()
        }
      ],
      triggers: [],
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success
    }
    const mockApiCall = auditLogApi
      .post(`/messages/${phase1Result.correlationId}/events`)
      .mockImplementationOnce((ctx) => {
        ctx.status = 204
      })

    await storeAuditLogEvents.execute({
      inputData: { correlationId: phase1Result.correlationId, auditLogEvents: phase1Result.auditLogEvents }
    })
    expect(mockApiCall).toHaveBeenCalledTimes(1)
    expect(mockApiCall.mock.calls[0][0].request).toHaveProperty("body", phase1Result.auditLogEvents)
  })

  it("should throw an exception if it fails to write to the audit log", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [
        {
          eventCode: "dummyEventCode",
          eventSource: "Test",
          eventType: "Type",
          category: EventCategory.error,
          timestamp: new Date().toISOString()
        }
      ],
      triggers: [],
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success
    }
    const mockApiCall = auditLogApi
      .post(`/messages/${phase1Result.correlationId}/events`)
      .mockImplementationOnce((ctx) => {
        ctx.status = 500
      })

    let errorThrown = false
    try {
      await storeAuditLogEvents.execute({
        inputData: { correlationId: phase1Result.correlationId, auditLogEvents: phase1Result.auditLogEvents }
      })
    } catch (e) {
      errorThrown = true
    }
    expect(errorThrown).toBeTruthy()
    expect(mockApiCall).toHaveBeenCalledTimes(1)
  })
})
