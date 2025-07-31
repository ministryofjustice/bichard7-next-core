import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { sortBy } from "lodash"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by allocated to username e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = {
    maxPerPage: 25,
    pageNum: 1,
    reason: Reason.All
  }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 5, {
      0: { errorLockedById: "user", triggerLockedById: "user" },
      1: { errorLockedById: "user", triggerLockedById: null },
      2: { errorLockedById: null, triggerLockedById: "user" },
      3: { errorLockedById: null, triggerLockedById: null },
      4: { errorLockedById: "anotherUser", triggerLockedById: "anotherUser" }
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
    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(5)
    expect(caseMetadata.totalCases).toBe(5)
    expect(caseMetadata.returnCases).toBe(5)
  })

  it("will filter when given a query value of allocatedUsername", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { allocatedUsername: "user", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
    expect(sortBy(caseMetadata.cases, "errorId").map((c) => c.errorId)).toStrictEqual([0, 1, 2])
  })
})
