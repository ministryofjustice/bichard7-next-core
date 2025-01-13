import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/e2e-tests/utils/isError"

import type Phase3Result from "./types/Phase3Result"
import type PncUpdateRequestError from "./types/PncUpdateRequestError"

import MockPncGateway from "../comparison/lib/MockPncGateway"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import { PncApiError } from "../lib/PncGateway"
import { PncOperation } from "../types/PncOperation"
import phase3 from "./phase3"
import generatePncUpdateDatasetWithOperations from "./tests/helpers/generatePncUpdateDatasetWithOperations"
import { Phase3ResultType } from "./types/Phase3Result"

describe("Bichard Core Phase 3 processing logic", () => {
  let auditLogger: CoreAuditLogger

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
  })

  it("returns exceptions when updating the PNC fails", async () => {
    const pncGateway = new MockPncGateway([new PncApiError(["I0007: Some PNC error message"])])

    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        status: "NotAttempted",
        data: {
          courtCaseReference: "97/1626/008395Q"
        }
      }
    ])

    const result = (await phase3(pncUpdateDataset, pncGateway, auditLogger)) as Phase3Result

    expect(result.resultType).toBe(Phase3ResultType.exceptions)
    expect(result.outputMessage.Exceptions).toContainEqual({
      code: ExceptionCode.HO100401,
      message: "I0007: Some PNC error message",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
    })
    expect(result.outputMessage.PncOperations[0].status).toBe("Failed")
    expect(result.auditLogEvents).toStrictEqual([
      {
        attributes: {
          "Error 1 Details": "HO100401||ArrestSummonsNumber",
          "Exception Type": "HO100401",
          "Number Of Errors": 1
        },
        category: "information",
        eventCode: "exceptions.generated",
        eventSource: "CorePhase2",
        eventType: "Exceptions generated",
        timestamp: expect.any(Date)
      }
    ])
    expect(result.triggerGenerationAttempted).toBe(false)
  })

  it("should not update the PNC when there's an error generating the requests", async () => {
    const pncGateway = new MockPncGateway([])

    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      { code: PncOperation.REMAND, status: "NotAttempted" },
      { code: PncOperation.REMAND, status: "NotAttempted" }
    ])

    const result = await phase3(pncUpdateDataset, pncGateway, auditLogger)

    expect(isError(result)).toBe(true)
    expect((result as PncUpdateRequestError).messages).toStrictEqual([
      "Operation 0: Could not find results to use for remand operation.",
      "Operation 1: Could not find results to use for remand operation."
    ])
    expect(pncGateway.updates).toHaveLength(0)
  })

  it("generates triggers when all operations are completed", async () => {
    const pncGateway = new MockPncGateway([undefined])

    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        status: "NotAttempted",
        data: {
          courtCaseReference: "97/1626/008395Q"
        }
      }
    ])

    const result = (await phase3(pncUpdateDataset, pncGateway, auditLogger)) as Phase3Result

    expect(result.resultType).toBe(Phase3ResultType.success)
    expect(result.triggerGenerationAttempted).toBe(true)
    expect(result.triggers).toStrictEqual([{ code: "TRPR0010" }, { code: "TRPR0027" }])
    expect(result.outputMessage.PncOperations[0].status).toBe("Completed")
    expect(result.auditLogEvents).toStrictEqual([
      {
        attributes: {
          "Number of Triggers": 2,
          "Trigger 1 Details": "TRPR0010",
          "Trigger 2 Details": "TRPR0027",
          "Trigger and Exception Flag": false
        },
        category: "information",
        eventCode: "triggers.generated",
        eventSource: "CorePhase2",
        eventType: "Triggers generated",
        timestamp: expect.any(Date)
      }
    ])
  })
})
