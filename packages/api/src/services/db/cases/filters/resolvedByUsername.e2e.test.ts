import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

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

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 3, {
      0: { errorResolvedBy: resolvedByUsername, triggerResolvedBy: null },
      1: { errorResolvedBy: null, triggerResolvedBy: resolvedByUsername },
      2: { errorResolvedBy: resolvedByUsername, triggerResolvedBy: resolvedByUsername },
      3: { errorResolvedBy: resolvedByUsernameNotUsed, triggerResolvedBy: null }
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
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { resolvedByUsername: resolvedByUsername.toLowerCase(), ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })

  it("will match cases when the resolved by username is a partial match", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { resolvedByUsername: resolvedByUsernamePartial, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })

  it("will match cases when the resolved by username is a with wildcard", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { resolvedByUsername: "*en*hand", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
