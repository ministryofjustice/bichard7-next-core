import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { fetchCasesAndFilter } from "../../useCases/cases/fetchCasesAndFilter"
import { createCases } from "../helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../helpers/setupAppEnd2EndHelper"
import { createUsers } from "../helpers/userHelper"

describe("fetchCasesAndFilter pagination e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
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
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { maxPerPage: 25, pageNum: 1 }, user)

    expect(caseMetadata.cases).toHaveLength(25)
    expect(caseMetadata.maxPerPage).toBe(25)
    expect(caseMetadata.pageNum).toBe(1)
    expect(caseMetadata.returnCases).toBe(25)
    expect(caseMetadata.totalCases).toBe(123)
  })

  it("will handle 25 per page returning 23 cases on page 5", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { maxPerPage: 25, pageNum: 5 }, user)

    expect(caseMetadata.cases).toHaveLength(23)
    expect(caseMetadata.maxPerPage).toBe(25)
    expect(caseMetadata.pageNum).toBe(5)
    expect(caseMetadata.returnCases).toBe(23)
    expect(caseMetadata.totalCases).toBe(123)
  })

  it("will handle 200 per page", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { maxPerPage: 200, pageNum: 1 }, user)

    expect(caseMetadata.cases).toHaveLength(123)
    expect(caseMetadata.maxPerPage).toBe(200)
    expect(caseMetadata.pageNum).toBe(1)
    expect(caseMetadata.returnCases).toBe(123)
    expect(caseMetadata.totalCases).toBe(123)
  })
})
