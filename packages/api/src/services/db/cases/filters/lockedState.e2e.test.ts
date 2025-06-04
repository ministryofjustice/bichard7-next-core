import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { LockedState, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by Locked State e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const errorLockedByUsername = "BichardForce01"
  const triggerLockedByUsername = "BichardForce01"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 7, {
      0: { errorLockedById: errorLockedByUsername, triggerLockedById: triggerLockedByUsername },
      1: { errorLockedById: errorLockedByUsername, triggerLockedById: null },
      2: { errorLockedById: null, triggerLockedById: triggerLockedByUsername },
      3: { errorLockedById: null, triggerLockedById: null },
      4: { errorLockedById: user.username, triggerLockedById: null },
      5: { errorLockedById: null, triggerLockedById: user.username },
      6: { errorLockedById: user.username, triggerLockedById: user.username }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will fetch all cases when with no Locked State in the query", async () => {
    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(7)
    expect(caseMetadata.totalCases).toBe(7)
    expect(caseMetadata.returnCases).toBe(7)
  })

  it("will fetch all cases when Locked State is set to All", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { lockedState: LockedState.All, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(7)
    expect(caseMetadata.totalCases).toBe(7)
    expect(caseMetadata.returnCases).toBe(7)
  })

  it("will fetch cases which are locked", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { lockedState: LockedState.Locked, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.totalCases).toBe(6)
    expect(caseMetadata.returnCases).toBe(6)
  })

  it("will fetch cases which are unlocked", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { lockedState: LockedState.Unlocked, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorId).toBe(3)
  })

  it("will fetch cases which are locked to the current user", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { lockedState: LockedState.LockedToMe, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
