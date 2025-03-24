import type { ApiCaseQuerystring } from "@moj-bichard7/common/types/ApiCaseQuerystring"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuerystring"
import { sortBy } from "lodash"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by allocated to username e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuerystring = {
    maxPerPage: 25,
    pageNum: 1,
    reason: Reason.All
  }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 5, {
      0: { error_locked_by_id: "user", trigger_locked_by_id: "user" },
      1: { error_locked_by_id: "user", trigger_locked_by_id: null },
      2: { error_locked_by_id: null, trigger_locked_by_id: "user" },
      3: { error_locked_by_id: null, trigger_locked_by_id: null },
      4: { error_locked_by_id: "anotherUser", trigger_locked_by_id: "anotherUser" }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will not filter when not given a query value of allocatedUsername", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(5)
    expect(caseMetadata.totalCases).toBe(5)
    expect(caseMetadata.returnCases).toBe(5)
  })

  it("will filter when given a query value of allocatedUsername", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { allocatedUsername: "user", ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
    expect(sortBy(caseMetadata.cases, "errorId").map((c) => c.errorId)).toStrictEqual([0, 1, 2])
  })
})
