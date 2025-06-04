import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by defendant name e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const defendantToInclude = "WAYNE Bruce"
  const defendantToIncludeWithPartialMatch = "WAYNE Bill"
  const defendantToNotInclude = "GORDON Barbara"
  const defendantToNotIncludeSecond = "WAYNE Alfred"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 3, {
      0: { defendantName: defendantToInclude },
      1: { defendantName: defendantToIncludeWithPartialMatch },
      2: { defendantName: defendantToNotInclude },
      3: { defendantName: defendantToNotIncludeSecond }
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
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: defendantToInclude.toLowerCase(), ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })

  it("will match cases when the defendant name", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: defendantToInclude, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })

  it("will match cases with partial match", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: "wayne b", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match cases with user entered wildcard (*)", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: "wa*b", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match cases with user entered wildcard at end (*)", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: "wa*b*", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(caseMetadata.cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match case with user entered wildcard at end (*)", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { defendantName: "wa*br*", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.cases[0].defendantName).toStrictEqual(defendantToInclude)
  })
})
