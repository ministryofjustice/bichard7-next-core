import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import { Order, OrderBy, type Pagination } from "../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering PTIURN e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
  const PTIURNs = ["01009940223", "05003737622", "03001976220", "04007638323"]
  const ascending = [...PTIURNs].sort((one, two) => (one > two ? 1 : -1))
  const descending = [...PTIURNs].sort((one, two) => (one > two ? -1 : 1))

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]

    await createCases(helper.postgres, 4, {
      0: { ptiurn: PTIURNs[0] },
      1: { ptiurn: PTIURNs[1] },
      2: { ptiurn: PTIURNs[2] },
      3: { ptiurn: PTIURNs[3] }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will order the PTIURN and with the default ordering", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { orderBy: OrderBy.ptiurn, ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(ascending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(ascending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(ascending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(ascending[3])
  })

  it("will order the PTIURN by asc and with the default ordering", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.asc, orderBy: OrderBy.ptiurn, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(ascending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(ascending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(ascending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(ascending[3])
  })

  it("will order the PTIURN by desc and with the default ordering", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.desc, orderBy: OrderBy.ptiurn, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(descending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(descending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(descending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(descending[3])
  })
})
