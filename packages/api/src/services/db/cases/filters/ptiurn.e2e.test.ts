import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by PTIURN", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const ptiurnToInclude = "01ZD0303908"
  const ptiurnToIncludeWithPartialMatch = "01ZD0303909"
  const ptiurnToNotInclude = "00000000000"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)

    await createCases(helper.postgres, 3, {
      0: { ptiurn: ptiurnToInclude },
      1: { ptiurn: ptiurnToIncludeWithPartialMatch },
      2: { ptiurn: ptiurnToNotInclude }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases with ptiurn with '01ZD0303908'", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { ptiurn: "01ZD0303908", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
  })

  it("will match cases with partial ptiurn with '01ZD030390'", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { ptiurn: "01ZD030390", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)

    expect(caseMetadata.cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
    expect(caseMetadata.cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch)
  })
})
