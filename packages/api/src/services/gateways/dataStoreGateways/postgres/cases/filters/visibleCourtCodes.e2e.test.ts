import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import type { CaseIndexQuerystring } from "../../../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { Reason } from "../../../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by visible court codes from User", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = []
    helper.postgres.visibleCourts = ["BA", "BAUD"]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    const users = await createUsers(helper.postgres, 1, { 1: { visible_courts: "BA,BAUD", visible_forces: "" } })
    user = users[0]

    await createCases(helper.postgres, 4, {
      0: { court_code: "BA", org_for_police_filter: null },
      1: { court_code: "BAUD", org_for_police_filter: null },
      2: { court_code: "BAHP", org_for_police_filter: null },
      3: { court_code: "XBA", org_for_police_filter: null }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases with court codes starting with 'BA'", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
