import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import checkAllTriggersResolved from "./checkAllTriggersResolved"
const testDatabaseGateway = new End2EndPostgres()

describe("fetchCase", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns true when a case has no triggers", async () => {
    const caseObj = await createCase(testDatabaseGateway)

    const result = await checkAllTriggersResolved(testDatabaseGateway.readonly, caseObj.errorId)

    if (isError(result)) {
      throw result
    }

    expect(result).toBe(true)
  })

  it("returns true when all triggers for the case are resolved", async () => {
    const caseObj = await createCase(testDatabaseGateway)
    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { status: ResolutionStatusNumber.Resolved },
      { status: ResolutionStatusNumber.Resolved }
    ])

    const result = await checkAllTriggersResolved(testDatabaseGateway.readonly, caseObj.errorId)

    if (result instanceof Error) {
      throw result
    }

    expect(result).toBe(true)
  })

  it("returns false when at least one trigger is unresolved", async () => {
    const caseObj = await createCase(testDatabaseGateway)
    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { status: ResolutionStatusNumber.Resolved },
      { status: ResolutionStatusNumber.Unresolved }
    ])

    const result = await checkAllTriggersResolved(testDatabaseGateway.readonly, caseObj.errorId)

    if (result instanceof Error) {
      throw result
    }

    expect(result).toBe(false)
  })

  it("returns false when all triggers on the case are unresolved", async () => {
    const caseObj = await createCase(testDatabaseGateway)
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ status: ResolutionStatusNumber.Unresolved }])

    const result = await checkAllTriggersResolved(testDatabaseGateway.readonly, caseObj.errorId)

    if (result instanceof Error) {
      throw result
    }

    expect(result).toBe(false)
  })

  it("ignores trigger statuses belonging to other cases", async () => {
    const caseA = await createCase(testDatabaseGateway, { errorId: 1 })
    const caseB = await createCase(testDatabaseGateway, { errorId: 2 })

    await createTriggers(testDatabaseGateway, caseA.errorId, [{ status: ResolutionStatusNumber.Resolved }])
    await createTriggers(testDatabaseGateway, caseB.errorId, [{ status: ResolutionStatusNumber.Unresolved }])

    const result = await checkAllTriggersResolved(testDatabaseGateway.readonly, caseA.errorId)

    if (result instanceof Error) {
      throw result
    }

    expect(result).toBe(true)
  })

  it("returns an error when the database connection fails", async () => {
    const mockDbConnection = {
      connection: jest.fn().mockImplementation(() => Promise.reject(new Error("Database query failed")))
    } as unknown as DatabaseConnection

    const result = await checkAllTriggersResolved(mockDbConnection, 1)

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe(
      "Failed to check if all triggers are resolved for case 1: Database query failed"
    )
  })
})
