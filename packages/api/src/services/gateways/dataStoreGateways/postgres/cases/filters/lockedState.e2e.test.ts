import type { ApiCaseQuerystring } from "@moj-bichard7/common/types/ApiCaseQuerystring"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { LockedState, Reason } from "@moj-bichard7/common/types/ApiCaseQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by Locked State e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const errorLockedByUsername = "BichardForce01"
  const triggerLockedByUsername = "BichardForce01"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 7, {
      0: { error_locked_by_id: errorLockedByUsername, trigger_locked_by_id: triggerLockedByUsername },
      1: { error_locked_by_id: errorLockedByUsername, trigger_locked_by_id: null },
      2: { error_locked_by_id: null, trigger_locked_by_id: triggerLockedByUsername },
      3: { error_locked_by_id: null, trigger_locked_by_id: null },
      4: { error_locked_by_id: user.username, trigger_locked_by_id: null },
      5: { error_locked_by_id: null, trigger_locked_by_id: user.username },
      6: { error_locked_by_id: user.username, trigger_locked_by_id: user.username }
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
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(7)
    expect(caseMetadata.totalCases).toBe(7)
    expect(caseMetadata.returnCases).toBe(7)
  })

  it("will fetch all cases when Locked State is set to All", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { lockedState: LockedState.All, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(7)
    expect(caseMetadata.totalCases).toBe(7)
    expect(caseMetadata.returnCases).toBe(7)
  })

  it("will fetch cases which are locked", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { lockedState: LockedState.Locked, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.totalCases).toBe(6)
    expect(caseMetadata.returnCases).toBe(6)
  })

  it("will fetch cases which are unlocked", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { lockedState: LockedState.Unlocked, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(5)
    expect(caseMetadata.totalCases).toBe(5)
    expect(caseMetadata.returnCases).toBe(5)
  })

  it("will fetch cases which are locked to the current user", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { lockedState: LockedState.LockedToMe, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
