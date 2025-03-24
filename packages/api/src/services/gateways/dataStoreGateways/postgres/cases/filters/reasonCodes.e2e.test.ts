import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { CaseIndexQuerystring } from "../../../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { createExceptionOnCase } from "../../../../../../tests/helpers/exceptionHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createTriggers } from "../../../../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { Reason } from "../../../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"
import { ResolutionStatusNumber } from "../../../../../../useCases/dto/convertResolutionStatus"

describe("fetchCasesAndFilter filtering by reason codes e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
    const cases = await createCases(helper.postgres, 3)

    await createExceptionOnCase(helper.postgres, cases[0].error_id, "HO100300", "HO100300||b7.errorReport")
    await createTriggers(helper.postgres, cases[0].error_id, [
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0010 }
    ] as Trigger[])

    await createExceptionOnCase(helper.postgres, cases[1].error_id, "HO999999", "HO999999||b7.errorReport")
    await createTriggers(helper.postgres, cases[1].error_id, [
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0012 },
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0020 }
    ] as Trigger[])

    await createExceptionOnCase(helper.postgres, cases[2].error_id, "HO100322", "HO100322||b7.OrganisationUnitCode")
    await createExceptionOnCase(helper.postgres, cases[2].error_id, "HO100323", "HO100323||b7.NextHearingDate")
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will handle a string as a reason code", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { reasonCodes: "HO100300", ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorReport).toContain("HO100300")
  })

  it("will handle an array of strings as a reason code", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { reasonCodes: ["HO100300"], ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].errorReport).toContain("HO100300")
  })

  it("will return triggers", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { reasonCodes: [TriggerCode.TRPR0010, TriggerCode.TRPR0012], ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
  })

  it("will return exceptions", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { reasonCodes: ["HO100300", "HO100322", "HO100323"], ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
  })

  it("will return exceptions and triggers", async () => {
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      {
        reasonCodes: ["HO100300", "HO100322", "HO100323", TriggerCode.TRPR0010, TriggerCode.TRPR0012],
        ...defaultQuery
      },
      user
    )

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.totalCases).toBe(3)
    expect(caseMetadata.returnCases).toBe(3)
  })
})
