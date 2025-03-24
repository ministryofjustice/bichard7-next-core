import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import type { CaseIndexQuerystring } from "../../../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { Reason } from "../../../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by court name e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const courtNameToInclude = "Magistrates' Courts London Croydon"
  const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
  const courtNameToNotInclude = "Court Name not to include"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    await createCases(helper.postgres, 3, {
      0: { court_name: courtNameToInclude },
      1: { court_name: courtNameToIncludeWithPartialMatch },
      2: { court_name: courtNameToNotInclude }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases when the court name is case insensitive", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { courtName: courtNameToInclude.toLowerCase(), ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].courtName).toStrictEqual(courtNameToInclude)
  })

  it("will match cases when the court name with partial match", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { courtName: "courts london", ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases[0].courtName).toStrictEqual(courtNameToInclude)
    expect(caseMetadata.cases[1].courtName).toStrictEqual(courtNameToIncludeWithPartialMatch)
  })
})
