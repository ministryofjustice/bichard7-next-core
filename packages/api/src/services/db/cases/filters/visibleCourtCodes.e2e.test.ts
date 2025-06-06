import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by visible court codes from User", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres, { visibleCourts: ["BA", "BAUD"], visibleForces: [] })

    await createCases(helper.postgres, 4, {
      0: { courtCode: "BA", orgForPoliceFilter: "" },
      1: { courtCode: "BAUD", orgForPoliceFilter: "" },
      2: { courtCode: "BAHP", orgForPoliceFilter: "" },
      3: { courtCode: "XBA", orgForPoliceFilter: "" }
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
    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
