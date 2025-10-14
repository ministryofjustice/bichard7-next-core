import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Order, OrderBy, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCases/fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering PTIURN e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  const PTIURNs = ["01009940223", "05003737622", "03001976220", "04007638323"]
  const ascending = [...PTIURNs].sort((one, two) => (one > two ? 1 : -1))
  const descending = [...PTIURNs].sort((one, two) => (one > two ? -1 : 1))

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)

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
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { orderBy: OrderBy.ptiurn, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(ascending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(ascending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(ascending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(ascending[3])
  })

  it("will order the PTIURN by asc and with the default ordering", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.asc, orderBy: OrderBy.ptiurn, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(ascending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(ascending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(ascending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(ascending[3])
  })

  it("will order the PTIURN by desc and with the default ordering", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.desc, orderBy: OrderBy.ptiurn, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(4)
    expect(caseMetadata.cases[0].ptiurn).toBe(descending[0])
    expect(caseMetadata.cases[1].ptiurn).toBe(descending[1])
    expect(caseMetadata.cases[2].ptiurn).toBe(descending[2])
    expect(caseMetadata.cases[3].ptiurn).toBe(descending[3])
  })
})
