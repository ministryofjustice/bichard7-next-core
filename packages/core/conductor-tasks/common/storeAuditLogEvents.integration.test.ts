process.env.AUDIT_LOG_API_URL = "http://localhost:11001"
process.env.AUDIT_LOG_API_KEY = "dummy"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { MockServer } from "jest-mock-server"
import type { Phase1SuccessResult } from "../../phase1/types/Phase1Result"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import storeAuditLogEvents from "./storeAuditLogEvents"

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
          eventCode: EventCode.AllTriggersResolved,
          eventSource: "Test",
          eventType: "Type",
          category: EventCategory.information,
          timestamp: new Date()
        },
        {
          eventCode: EventCode.DuplicateMessage,
          eventSource: "Test2",
          eventType: "Type2",
          category: EventCategory.error,
          timestamp: new Date()
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
    const expectedAuditLogEvents = phase1Result.auditLogEvents.map((e) => ({
      ...e,
      timestamp: e.timestamp.toISOString()
    }))
    expect(mockApiCall.mock.calls[0][0].request).toHaveProperty("body", expectedAuditLogEvents)
  })

  it("should throw an exception if it fails to write to the audit log", async () => {
    const phase1Result: Phase1SuccessResult = {
      correlationId: "dummy-id",
      auditLogEvents: [
        {
          eventCode: EventCode.AllTriggersResolved,
          eventSource: "Test",
          eventType: "Type",
          category: EventCategory.error,
          timestamp: new Date()
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
