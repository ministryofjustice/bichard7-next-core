import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"
import { ResolutionStatus, ResolutionStatusNumber } from "../../../../../../useCases/dto/convertResolutionStatus"

describe("fetchCasesAndFilter filtering by resolved case date e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = {
    caseState: ResolutionStatus.Resolved,
    maxPerPage: 25,
    pageNum: 1,
    reason: Reason.All
  }
  const firstDate = new Date("2001-09-26")
  const secondDate = new Date("2008-01-26")
  const thirdDate = new Date("2008-03-26")
  const fourthDate = new Date("2013-10-16")

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 4, {
      0: {
        court_date: firstDate,
        error_resolved_by: user.username,
        error_status: ResolutionStatusNumber.Resolved,
        resolution_ts: firstDate
      },
      1: {
        court_date: secondDate,
        error_resolved_by: user.username,
        error_status: ResolutionStatusNumber.Resolved,
        resolution_ts: secondDate
      },
      2: {
        court_date: thirdDate,
        error_resolved_by: user.username,
        error_status: ResolutionStatusNumber.Resolved,
        resolution_ts: null,
        trigger_status: ResolutionStatusNumber.Unresolved
      },
      3: {
        court_date: fourthDate,
        error_resolved_by: user.username,
        error_status: ResolutionStatusNumber.Resolved,
        resolution_ts: fourthDate
      }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will filter resolved cases within a start and end date", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        resolvedFrom: new Date("2008-01-01"),
        resolvedTo: new Date("2008-12-31"),
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases.map((c) => c.errorId)).toStrictEqual([1])
  })

  it("Should filter resolved cases by a single date", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        resolvedFrom: new Date("2008-01-26"),
        resolvedTo: new Date("2008-01-26"),
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorId).toBe(1)
  })

  it("will return no cases where the date range only contains unresolved cases", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        resolvedFrom: new Date("2008-03-01"),
        resolvedTo: new Date("2008-03-30"),
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(0)
    expect(caseMetadata.totalCases).toBe(0)
    expect(caseMetadata.returnCases).toBe(0)
  })
})
