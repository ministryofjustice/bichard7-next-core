import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Order, OrderBy, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering Defendant Name e2e", () => {
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

    const courtDates = [new Date("09/12/2021"), new Date("04/01/2022"), new Date("01/07/2020")]
    await createCases(helper.postgres, 6, {
      0: { courtDate: courtDates[0], defendantName: "WAYNE Bruce", ptiurn: "Case00" },
      1: { courtDate: courtDates[1], defendantName: "WAYNE Bruce", ptiurn: "Case01" },
      2: { courtDate: courtDates[2], defendantName: "WAYNE Bruce", ptiurn: "Case02" },
      3: { courtDate: courtDates[0], defendantName: "PENNYWORTH Alfred", ptiurn: "Case03" },
      4: { courtDate: courtDates[1], defendantName: "PENNYWORTH Alfred", ptiurn: "Case04" },
      5: { courtDate: courtDates[2], defendantName: "PENNYWORTH Alfred", ptiurn: "Case05" }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will order the defendant and with the default ordering", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case02")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case05")
  })

  it("will order the defendant by asc and with the default ordering", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.asc, orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case05")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case02")
  })

  it("will order the defendant by desc and with the default ordering", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.desc, orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case02")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case05")
  })
})
