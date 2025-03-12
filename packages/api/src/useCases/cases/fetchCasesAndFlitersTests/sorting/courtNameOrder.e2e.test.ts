import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import { Order, OrderBy, type Pagination } from "../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering courtName e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 3, {
      0: { court_name: "AAAA" },
      1: { court_name: "BBBB" },
      2: { court_name: "CCCC" }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will order the case name by asc by default", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("AAAA")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("CCCC")
  })

  it("will order the case name by asc when it is specifically set", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.asc, orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("AAAA")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("CCCC")
  })

  it("will order the case name by DESC", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.desc, orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("CCCC")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("AAAA")
  })
})
