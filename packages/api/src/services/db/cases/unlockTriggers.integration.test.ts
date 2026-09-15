import { isError } from "@moj-bichard7/common/types/Result"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import unlockTrigger from "./unlockTriggers"

describe("unlockTriggers integration", () => {
  let databaseGateway: End2EndPostgres

  beforeAll(() => {
    databaseGateway = new End2EndPostgres()
  })

  beforeEach(async () => {
    await databaseGateway.clearDb()
  })

  afterAll(async () => {
    await databaseGateway.close()
  })

  it("unlocks triggers for a locked case", async () => {
    const caseObj = await createCase(databaseGateway, {
      triggerLockedById: "test_user"
    })

    const result = await databaseGateway.writable.transaction((tx) => unlockTrigger(tx, caseObj.errorId))

    expect(result).toBeUndefined()

    const [dbCase] = await databaseGateway.writable.connection`
      SELECT trigger_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(dbCase.trigger_locked_by_id).toBeNull()
  })

  it("succeeds when case is already unlocked", async () => {
    const caseObj = await createCase(databaseGateway, {
      triggerLockedById: null
    })

    const result = await databaseGateway.writable.transaction((tx) => unlockTrigger(tx, caseObj.errorId))

    expect(result).toBeUndefined()

    const [dbCase] = await databaseGateway.writable.connection`
      SELECT trigger_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(dbCase.trigger_locked_by_id).toBeNull()
  })

  it("returns 404 NotFound when the case does not exist", async () => {
    const result = await databaseGateway.writable.transaction((tx) => unlockTrigger(tx, 99999))
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("returns error when the database query fails", async () => {
    const mockTx = {
      connection: jest.fn().mockImplementation(() => Promise.reject(new Error("Connection error")))
    } as unknown as TransactionConnection

    const result = await unlockTrigger(mockTx, 1)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Couldn't unlock triggers for case id 1: Connection error")
  })
})
