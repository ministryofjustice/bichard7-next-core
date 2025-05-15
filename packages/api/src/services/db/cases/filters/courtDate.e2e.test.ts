import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by court date e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const firstDate = new Date("2001-09-26")
  const secondDate = new Date("2008-01-26")
  const thirdDate = new Date("2008-03-26")
  const fourthDate = new Date("2013-10-16")

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 4, {
      0: { court_date: firstDate },
      1: { court_date: secondDate },
      2: { court_date: thirdDate },
      3: { court_date: fourthDate }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will filter cases within a start and end date", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        from: new Date("2008-01-01"),
        to: new Date("2008-12-31"),
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases.map((c) => c.errorId)).toStrictEqual([2, 1])
  })

  it("Should filter cases by a single date", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        from: new Date("2008-01-26"),
        to: new Date("2008-01-26"),
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorId).toBe(1)
  })
})
