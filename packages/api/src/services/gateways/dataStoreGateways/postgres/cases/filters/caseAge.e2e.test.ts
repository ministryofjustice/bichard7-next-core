import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { subDays } from "date-fns"

import type { CaseIndexQuerystring } from "../../../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { Reason } from "../../../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by Case Age e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const today = new Date()
  const yesterday = subDays(new Date(), 1)
  const twoDaysAgo = subDays(new Date(), 2)
  const threeDaysAgo = subDays(new Date(), 3)
  const longTimeAgo = new Date("2001-09-26")

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 5, {
      0: { court_date: today },
      1: { court_date: yesterday },
      2: { court_date: twoDaysAgo },
      3: { court_date: threeDaysAgo },
      4: { court_date: longTimeAgo }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will fetch all cases when with no case age in the query", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(5)
    expect(caseMetadata.totalCases).toBe(5)
    expect(caseMetadata.returnCases).toBe(5)
  })

  it("will fetch cases when with 'Today' as the case age in the query", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { caseAge: [CaseAge.Today], ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
  })

  it("will fetch cases when given multi case age in the query", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        caseAge: [CaseAge.Today, CaseAge.TwoDaysAgo, CaseAge.FiveDaysAgo, CaseAge.FifteenDaysAgoAndOlder],
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
