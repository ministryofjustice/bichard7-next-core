import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import type { CaseIndexQuerystring } from "../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import { Order, OrderBy, Reason } from "../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering courtDate e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const firstDate = new Date("2001-09-26")
  const secondDate = new Date("2008-01-26")
  const thirdDate = new Date("2013-10-16")
  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 3, {
      0: { court_date: secondDate },
      1: { court_date: firstDate },
      2: { court_date: thirdDate }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will order the case name by asc", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.asc, orderBy: OrderBy.courtDate, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtDate).toStrictEqual(firstDate)
    expect(caseMetadata.cases[1].courtDate).toStrictEqual(secondDate)
    expect(caseMetadata.cases[2].courtDate).toStrictEqual(thirdDate)
  })

  it("will order the case name by DESC", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.desc, orderBy: OrderBy.courtDate, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtDate).toStrictEqual(thirdDate)
    expect(caseMetadata.cases[1].courtDate).toStrictEqual(secondDate)
    expect(caseMetadata.cases[2].courtDate).toStrictEqual(firstDate)
  })
})
