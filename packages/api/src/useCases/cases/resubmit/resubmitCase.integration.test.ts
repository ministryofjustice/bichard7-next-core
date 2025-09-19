import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { resubmitCase } from "./resubmitCase"

describe("resubmitCase", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("bubbles an error if it receives an error from canUserResubmitCase", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })

    expect(await resubmitCase(testDatabaseGateway.writable, user, 1)).toEqual(new Error("Case not found"))
  })

  it("returns an error if the user can't resubmit", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: user.username })

    const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId)

    expect(result).toEqual(new Error("User can't resubmit"))
  })

  it("updates the case to be submitted", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: user.username })

    const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId)

    if (isError(result)) {
      throw result
    }

    expect(result).toBe(true)
  })
})
