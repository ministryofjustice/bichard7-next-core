import type { TriggerRow } from "@moj-bichard7/common/types/Trigger"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { isError } from "@moj-bichard7/common/types/Result"

import { createCases } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { getAllTriggers } from "./getAllTriggers"

const testDatabaseGateway = new End2EndPostgres()

describe("getAllTriggers", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should return an array of triggers exclusively for the given court case ID", async () => {
    const [caseObj, otherCaseObj] = await createCases(testDatabaseGateway, 2)

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: TriggerCode.TRPR0001 },
      { triggerCode: TriggerCode.TRPR0002 }
    ])
    await createTriggers(testDatabaseGateway, otherCaseObj.errorId, [{ triggerCode: TriggerCode.TRPR0003 }])

    let result: Error | TriggerRow[] | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await getAllTriggers(tx, caseObj.errorId)
    })

    expect(isError(result)).toBe(false)

    const triggers = result as TriggerRow[]
    expect(triggers).toHaveLength(2)

    triggers.forEach((trigger) => {
      expect(trigger.error_id).toBe(caseObj.errorId)
    })
  })

  it("should return an error if the database query fails", async () => {
    const brokenTx = {
      connection: jest.fn().mockRejectedValue(new Error("Simulated Database Error"))
    }
    const courtCaseId = 1

    const result = await getAllTriggers(brokenTx as any, courtCaseId)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toContain("Couldn't fetch triggers for court case 1: Simulated Database Error")
  })
})
