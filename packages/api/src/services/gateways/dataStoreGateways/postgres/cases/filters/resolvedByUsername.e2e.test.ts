import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by resolved by username e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const resolvedByUsername = "GeneralHandler"
  const resolvedByUsernamePartial = "neralHand"
  const resolvedByUsernameNotUsed = "ExceptionHandler"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 3, {
      0: { error_resolved_by: resolvedByUsername, trigger_resolved_by: null },
      1: { error_resolved_by: null, trigger_resolved_by: resolvedByUsername },
      2: { error_resolved_by: resolvedByUsername, trigger_resolved_by: resolvedByUsername },
      3: { error_resolved_by: resolvedByUsernameNotUsed, trigger_resolved_by: null }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases when the resolved by username is case insensitive", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { resolvedByUsername: resolvedByUsername.toLowerCase(), ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })

  it("will match cases when the resolved by username is a partial match", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { resolvedByUsername: resolvedByUsernamePartial, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })

  it("will match cases when the resolved by username is a with wildcard", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { resolvedByUsername: "*en*hand", ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
