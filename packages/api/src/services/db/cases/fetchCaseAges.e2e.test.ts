import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { subDays } from "date-fns"
import MockDate from "mockdate"

import { createCases } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../useCases/cases/fetchCasesAndFilter"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"

const defaultQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

describe("fetchCasesAndFilter fetchCaseAges e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User
  let userWithExcludedTrigger: User
  let userOutOfArea: User

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    userWithExcludedTrigger = await createUser(helper.postgres, {
      excludedTriggers: [TriggerCode.TRPR0001, TriggerCode.TRPR0002]
    })
    userOutOfArea = await createUser(helper.postgres, { visibleCourts: ["XY"], visibleForces: ["03"] })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
    MockDate.reset()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will show the case ages correctly", async () => {
    const dateToday = new Date("2001-09-26")
    const dateYesterday = subDays(dateToday, 1)
    const dateDay2 = subDays(dateToday, 2)
    const dateDay3 = subDays(dateToday, 3)
    const dateDay14 = subDays(dateToday, 14)
    const firstDateOlderThanDay14 = subDays(dateToday, 15)
    const secondDateOlderThanDay14 = subDays(dateToday, 36)
    const thirdDateOlderThanDay14 = subDays(dateToday, 400)
    MockDate.set(dateToday)

    await createCases(helper.postgres, 14, {
      0: { courtDate: dateToday },
      1: { courtDate: dateToday },
      2: { courtDate: dateToday },
      3: { courtDate: dateToday },
      4: { courtDate: dateYesterday },
      5: { courtDate: dateYesterday },
      6: { courtDate: dateYesterday },
      7: { courtDate: dateDay2 },
      8: { courtDate: dateDay2 },
      9: { courtDate: dateDay3 },
      10: { courtDate: dateDay14 },
      11: { courtDate: firstDateOlderThanDay14 },
      12: { courtDate: secondDateOlderThanDay14 },
      13: { courtDate: thirdDateOlderThanDay14 }
    })

    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(14)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("4")
    expect(caseMetadata.caseAges[CaseAge.Yesterday]).toBe("3")
    expect(caseMetadata.caseAges[CaseAge.TwoDaysAgo]).toBe("2")
    expect(caseMetadata.caseAges[CaseAge.ThreeDaysAgo]).toBe("1")
    expect(caseMetadata.caseAges[CaseAge.FourteenDaysAgo]).toBe("1")
    expect(caseMetadata.caseAges[CaseAge.FifteenDaysAgoAndOlder]).toBe("3")
  })

  it("will ignore exceptions resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday },
      1: { courtDate: dateToday },
      2: { courtDate: dateToday, errorStatus: 2, triggerStatus: null }
    })

    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will ignore trigger resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday },
      1: { courtDate: dateToday },
      2: { courtDate: dateToday, errorStatus: null, triggerStatus: 2 }
    })

    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will show error unresolved and trigger resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday },
      1: { courtDate: dateToday },
      2: { courtDate: dateToday, errorStatus: 1, triggerStatus: 2 }
    })

    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("3")
  })

  it("will show error resolved and trigger unresolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday },
      1: { courtDate: dateToday },
      2: { courtDate: dateToday, errorStatus: 2, triggerStatus: 1 }
    })
    await createTriggers(helper.postgres, 2, [{ createdAt: dateToday, status: 1, triggerCode: "TRP1111" } as Trigger])

    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("3")
  })

  it("will ignore cases that are outside of the users organisation", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday, orgForPoliceFilter: "03" },
      1: { courtDate: dateToday, orgForPoliceFilter: "03" },
      2: { courtDate: dateToday, orgForPoliceFilter: "02" }
    })

    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      defaultQuery,
      userOutOfArea
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will show 0 if there's matching case age", async () => {
    const caseMetadata = (await fetchCasesAndFilter(helper.postgres.readonly, defaultQuery, user)) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(0)
    Object.keys(caseMetadata.caseAges).forEach((key) => {
      expect(caseMetadata.caseAges[key]).toBe("0")
    })
  })

  it("will ignore excluded triggers", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { courtDate: dateToday, errorCount: 0 },
      1: { courtDate: dateToday, errorCount: 0 },
      2: { courtDate: dateToday, errorCount: 0 }
    })
    await createTriggers(helper.postgres, 0, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0001 }
    ] as Trigger[])
    await createTriggers(helper.postgres, 1, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0010 }
    ] as Trigger[])
    await createTriggers(helper.postgres, 2, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0020 }
    ] as Trigger[])

    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      defaultQuery,
      userWithExcludedTrigger
    )) as CaseIndexMetadata
    console.log(JSON.stringify(caseMetadata.cases, null, 2))

    expect(caseMetadata.cases).toHaveLength(2)
    // expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")

    /* eslint-disable perfectionist/sort-objects -- Don't need for this test */
    expect(caseMetadata.caseAges).toStrictEqual({
      [CaseAge.Today]: "2",
      [CaseAge.Yesterday]: "0",
      [CaseAge.TwoDaysAgo]: "0",
      [CaseAge.ThreeDaysAgo]: "0",
      [CaseAge.FourDaysAgo]: "0",
      [CaseAge.FiveDaysAgo]: "0",
      [CaseAge.SixDaysAgo]: "0",
      [CaseAge.SevenDaysAgo]: "0",
      [CaseAge.EightDaysAgo]: "0",
      [CaseAge.NineDaysAgo]: "0",
      [CaseAge.TenDaysAgo]: "0",
      [CaseAge.ElevenDaysAgo]: "0",
      [CaseAge.TwelveDaysAgo]: "0",
      [CaseAge.ThirteenDaysAgo]: "0",
      [CaseAge.FourteenDaysAgo]: "0",
      [CaseAge.FifteenDaysAgoAndOlder]: "0"
    })
  })
})
