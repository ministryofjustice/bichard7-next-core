import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import { Order, OrderBy, type Pagination } from "../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering Defendant Name e2e", () => {
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

    const courtDates = [new Date("09/12/2021"), new Date("04/01/2022"), new Date("01/07/2020")]
    await createCases(helper.postgres, 6, {
      0: { court_date: courtDates[0], defendant_name: "WAYNE Bruce", ptiurn: "Case00" },
      1: { court_date: courtDates[1], defendant_name: "WAYNE Bruce", ptiurn: "Case01" },
      2: { court_date: courtDates[2], defendant_name: "WAYNE Bruce", ptiurn: "Case02" },
      3: { court_date: courtDates[0], defendant_name: "PENNYWORTH Alfred", ptiurn: "Case03" },
      4: { court_date: courtDates[1], defendant_name: "PENNYWORTH Alfred", ptiurn: "Case04" },
      5: { court_date: courtDates[2], defendant_name: "PENNYWORTH Alfred", ptiurn: "Case05" }
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
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case02")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case05")
  })

  it("will order the defendant by asc and with the default ordering", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.asc, orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case05")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case02")
  })

  it("will order the defendant by desc and with the default ordering", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { order: Order.desc, orderBy: OrderBy.defendantName, ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(6)
    expect(caseMetadata.cases[0].ptiurn).toBe("Case01")
    expect(caseMetadata.cases[1].ptiurn).toBe("Case00")
    expect(caseMetadata.cases[2].ptiurn).toBe("Case02")
    expect(caseMetadata.cases[3].ptiurn).toBe("Case04")
    expect(caseMetadata.cases[4].ptiurn).toBe("Case03")
    expect(caseMetadata.cases[5].ptiurn).toBe("Case05")
  })
})
