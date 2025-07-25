import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter pagination e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 123)
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will handle 25 per page on page 1", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { maxPerPage: 25, pageNum: 1, reason: Reason.All },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(25)
    expect(caseMetadata.maxPerPage).toBe(25)
    expect(caseMetadata.pageNum).toBe(1)
    expect(caseMetadata.returnCases).toBe(25)
    expect(caseMetadata.totalCases).toBe(123)
  })

  it("will handle 25 per page returning 23 cases on page 5", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { maxPerPage: 25, pageNum: 5, reason: Reason.All },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(23)
    expect(caseMetadata.maxPerPage).toBe(25)
    expect(caseMetadata.pageNum).toBe(5)
    expect(caseMetadata.returnCases).toBe(23)
    expect(caseMetadata.totalCases).toBe(123)
  })

  it("will handle 200 per page", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { maxPerPage: 200, pageNum: 1, reason: Reason.All },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(123)
    expect(caseMetadata.maxPerPage).toBe(200)
    expect(caseMetadata.pageNum).toBe(1)
    expect(caseMetadata.returnCases).toBe(123)
    expect(caseMetadata.totalCases).toBe(123)
  })
})
