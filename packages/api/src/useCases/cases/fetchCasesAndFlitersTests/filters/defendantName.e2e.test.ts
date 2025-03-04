import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import type { Pagination } from "../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by defendant name e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
  const defendantToInclude = "WAYNE Bruce"
  const defendantToIncludeWithPartialMatch = "WAYNE Bill"
  const defendantToNotInclude = "GORDON Barbara"
  const defendantToNotIncludeSecond = "WAYNE Alfred"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 3, {
      0: { defendant_name: defendantToInclude },
      1: { defendant_name: defendantToIncludeWithPartialMatch },
      2: { defendant_name: defendantToNotInclude },
      3: { defendant_name: defendantToNotIncludeSecond }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases when the defendant name is case insensitive", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { defendantName: defendantToInclude.toLowerCase(), ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })

  it("will match cases when the defendant name", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { defendantName: defendantToInclude.toLowerCase(), ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })

  it("will match cases with wildcard match", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { defendantName: "wayne b", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match cases with user entered wildcard (*)", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { defendantName: "wa*b", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match cases with user entered wildcard at end (*)", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { defendantName: "wa*b*", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match case with user entered wildcard at end (*)", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { defendantName: "wa*br*", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })
})
