import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCases } from "../../../tests/helpers/caseHelper"
import { minimalUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { resubmitCases } from "./resubmitCases"

describe("resubmitCases", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("will error when there's no case IDs", async () => {
    const caseIds: number[] = []
    const nonSystemUser = minimalUser([UserGroup.Service])

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser, caseIds)

    if (!isError(result)) {
      throw new Error()
    }

    expect(result.message).toBe("No Case IDs given")
  })

  it("needs the System user", async () => {
    const caseIds: number[] = [1, 2]
    const nonSystemUser = minimalUser([UserGroup.GeneralHandler])

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser, caseIds)

    if (!isError(result)) {
      throw new Error()
    }

    expect(result.message).toBe("Missing System User")
  })

  it("will successfully resubmit 3 cases", async () => {
    const systemUser = minimalUser([UserGroup.Service], "System")
    const cases = await createCases(testDatabaseGateway, 3, {
      0: { errorLockedById: systemUser.username },
      1: { errorLockedById: systemUser.username },
      2: { errorLockedById: systemUser.username }
    })

    const result = await resubmitCases(
      testDatabaseGateway.writable,
      systemUser,
      cases.map((c) => c.errorId)
    )

    if (isError(result)) {
      throw result
    }

    for (const c of cases) {
      expect(result[c.errorId]).toBeDefined()
      expect(result[c.errorId]).toHaveProperty("messageId", c.messageId)
      expect(result[c.errorId]).toHaveProperty("success", true)
    }
  })
})
