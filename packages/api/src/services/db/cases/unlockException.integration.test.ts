import type { FastifyInstance } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import unlockException from "./unlockException"

describe("unlockException integration", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("unlocks exceptions for a locked case", async () => {
    const caseObj = await createCase(helper.postgres, {
      errorLockedById: "test_user"
    })

    const result = await helper.postgres.writable.transaction((tx) => unlockException(tx, caseObj.errorId))

    expect(result).toBeUndefined()

    const [dbCase] = await helper.postgres.writable.connection`
      SELECT error_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(dbCase.error_locked_by_id).toBeNull()
  })

  it("succeeds when case is already unlocked", async () => {
    const caseObj = await createCase(helper.postgres, {
      errorLockedById: null
    })

    const result = await helper.postgres.writable.transaction((tx) => unlockException(tx, caseObj.errorId))

    expect(result).toBeUndefined()

    const [dbCase] = await helper.postgres.writable.connection`
      SELECT error_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(dbCase.error_locked_by_id).toBeNull()
  })

  it("returns 404 NotFound when the case does not exist", async () => {
    const result = await helper.postgres.writable.transaction((tx) => unlockException(tx, 99999))
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("returns error when the database query fails", async () => {
    const mockTx = {
      connection: jest.fn().mockImplementation(() => Promise.reject(new Error("Connection error")))
    } as unknown as TransactionConnection

    const result = await unlockException(mockTx, 1)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Couldn't unlock exceptions for case id 1: Connection error")
  })
})
