import "../../tests/helpers/setEnvironmentVariables"

import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { AuditLogApiRecordOutput } from "@moj-bichard7/common/types/AuditLogRecord"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { randomUUID } from "node:crypto"

import type Phase1Result from "../../phase1/types/Phase1Result"

import { Phase1ResultType } from "../../phase1/types/Phase1Result"
import storeAuditLogEvents from "./storeAuditLogEvents"

const dummyAuditLogEvent = {
  eventCode: EventCode.AllTriggersResolved,
  eventSource: "Test",
  eventType: "Type",
  category: EventCategory.error,
  timestamp: new Date()
}

const invalidAuditLogEvent = {
  eventCode: EventCode.AllTriggersResolved,
  eventType: "Type",
  category: EventCategory.error,
  timestamp: new Date()
}

describe("storeAuditLogEvents", () => {
  let correlationId: string = ""
  const { apiKey, apiUrl, basePath } = createApiConfig()
  const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000, basePath)

  beforeEach(async () => {
    correlationId = randomUUID()

    await apiClient.createAuditLog({
      caseId: "dummy",
      createdBy: "system",
      externalCorrelationId: correlationId,
      isSanitised: 0,
      messageId: correlationId,
      messageHash: "dummy",
      receivedDate: "2025-02-03T09:11Z"
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should store multiple events in a single call to the API", async () => {
    const datetimeIso = "2025-11-11T10:21:42.175Z"
    const datetime = new Date(datetimeIso)
    jest.useFakeTimers()
    jest.setSystemTime(datetime)

    const phase1Result: Phase1Result = {
      correlationId,
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

    await storeAuditLogEvents.execute({
      inputData: { correlationId: phase1Result.correlationId, auditLogEvents: phase1Result.auditLogEvents }
    })

    const auditLog = (await apiClient.getAuditLog(phase1Result.correlationId)) as AuditLogApiRecordOutput

    expect(auditLog.events).toHaveLength(2)

    const expectedAuditLogEvents = phase1Result.auditLogEvents.map((e) => ({
      ...e,
      timestamp: datetimeIso
    }))
    expect(auditLog.events).toEqual(expect.arrayContaining(expectedAuditLogEvents))

    jest.useRealTimers()
  })

  it("should return FAILED if it fails to write to the audit log", async () => {
    const spy = jest
      .spyOn(AuditLogApiClient.prototype, "createEvents")
      .mockImplementation((): PromiseResult<void> => Promise.resolve(new Error("Failed to create event")))

    const phase1Result: Phase1Result = {
      correlationId,
      auditLogEvents: [dummyAuditLogEvent],
      triggers: [],
      hearingOutcome: {} as AnnotatedHearingOutcome,
      resultType: Phase1ResultType.success
    }

    const result = await storeAuditLogEvents.execute({
      inputData: { correlationId: phase1Result.correlationId, auditLogEvents: phase1Result.auditLogEvents }
    })
    const auditLog = (await apiClient.getAuditLog(phase1Result.correlationId)) as AuditLogApiRecordOutput

    expect(result.status).toBe("FAILED")
    expect(auditLog.events).toHaveLength(0)
    expect(spy).toHaveBeenCalled()
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
      inputData: { correlationId: "foo", auditLogEvents: [invalidAuditLogEvent] }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "InputData error: Expected string for auditLogEvents.0.eventSource"
    )
  })
})
