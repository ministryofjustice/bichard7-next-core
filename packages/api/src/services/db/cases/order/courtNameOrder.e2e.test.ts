import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Order, OrderBy, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCases/fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering courtName e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 3, {
      0: { courtName: "AAAA" },
      1: { courtName: "BBBB" },
      2: { courtName: "CCCC" }
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
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("AAAA")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("CCCC")
  })

  it("will order the case name by asc when it is specifically set", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.asc, orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("AAAA")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("CCCC")
  })

  it("will order the case name by DESC", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.desc, orderBy: OrderBy.courtName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].courtName).toBe("CCCC")
    expect(caseMetadata.cases[1].courtName).toBe("BBBB")
    expect(caseMetadata.cases[2].courtName).toBe("AAAA")
  })
})
