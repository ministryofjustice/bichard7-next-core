import type { ApiCaseQuerystring } from "@moj-bichard7/common/types/ApiCaseQuerystring"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by PTIURN", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const ptiurnToInclude = "01ZD0303908"
  const ptiurnToIncludeWithPartialMatch = "01ZD0303909"
  const ptiurnToNotInclude = "00000000000"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    const users = await createUsers(helper.postgres, 1)
    user = users[0]

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
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { ptiurn: "01ZD0303908", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
  })

  it("will match cases with partial ptiurn with '01ZD030390'", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { ptiurn: "01ZD030390", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)

    expect(caseMetadata.cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
    expect(caseMetadata.cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch)
  })
})
