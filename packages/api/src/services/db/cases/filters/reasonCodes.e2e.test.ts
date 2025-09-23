import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { createExceptionOnCase } from "../../../../tests/helpers/exceptionHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCase/fetchCasesAndFilter"
import { ResolutionStatusNumber } from "../../../../useCases/dto/convertResolutionStatus"

describe("fetchCasesAndFilter filtering by reason codes e2e", () => {
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
    const cases = await createCases(helper.postgres, 3)

    await createExceptionOnCase(helper.postgres, cases[0].errorId, "HO100300", "HO100300||b7.errorReport")
    await createTriggers(helper.postgres, cases[0].errorId, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0010 }
    ] as Trigger[])

    await createExceptionOnCase(helper.postgres, cases[1].errorId, "HO999999", "HO999999||b7.errorReport")
    await createTriggers(helper.postgres, cases[1].errorId, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0012 },
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0020 }
    ] as Trigger[])

    await createExceptionOnCase(helper.postgres, cases[2].errorId, "HO100322", "HO100322||b7.OrganisationUnitCode")
    await createExceptionOnCase(helper.postgres, cases[2].errorId, "HO100323", "HO100323||b7.NextHearingDate")
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will handle a string as a reason code", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { reasonCodes: "HO100300", ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorReport).toContain("HO100300")
  })

  it("will handle an array of strings as a reason code", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { reasonCodes: ["HO100300"], ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorReport).toContain("HO100300")
  })

  it("will return triggers", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { reasonCodes: [TriggerCode.TRPR0010, TriggerCode.TRPR0012], ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
  })

  it("will return exceptions", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { reasonCodes: ["HO100300", "HO100322", "HO100323"], ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
  })

  it("will return exceptions and triggers", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      {
        reasonCodes: ["HO100300", "HO100322", "HO100323", TriggerCode.TRPR0010, TriggerCode.TRPR0012],
        ...defaultQuery
      },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
