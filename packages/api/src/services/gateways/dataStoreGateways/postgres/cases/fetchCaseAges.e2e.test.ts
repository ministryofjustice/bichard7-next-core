import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { subDays } from "date-fns"
import MockDate from "mockdate"

import { createCases } from "../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createTriggers } from "../../../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../../../tests/helpers/userHelper"
import { fetchCasesAndFilter } from "../../../../../useCases/cases/fetchCasesAndFilter"
import { ResolutionStatusNumber } from "../../../../../useCases/dto/convertResolutionStatus"

const defaultQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

describe("fetchCasesAndFilter fetchCaseAges e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User
  let userWithExcludedTrigger: User

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    const users = await createUsers(helper.postgres, 2, {
      2: { excluded_triggers: `${TriggerCode.TRPR0001},${TriggerCode.TRPR0002}` }
    })

    user = users[0]
    userWithExcludedTrigger = users[1]
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
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday },
      3: { court_date: dateToday },
      4: { court_date: dateYesterday },
      5: { court_date: dateYesterday },
      6: { court_date: dateYesterday },
      7: { court_date: dateDay2 },
      8: { court_date: dateDay2 },
      9: { court_date: dateDay3 },
      10: { court_date: dateDay14 },
      11: { court_date: firstDateOlderThanDay14 },
      12: { court_date: secondDateOlderThanDay14 },
      13: { court_date: thirdDateOlderThanDay14 }
    })

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

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
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday, error_status: 2, trigger_status: null }
    })

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will ignore trigger resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday, error_status: null, trigger_status: 2 }
    })

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will show error unresolved and trigger resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday, error_status: 1, trigger_status: 2 }
    })

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("3")
  })

  it("will show error resolved and trigger unresolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday, error_status: 2, trigger_status: 1 }
    })
    await createTriggers(helper.postgres, 2, [{ create_ts: dateToday, status: 1, trigger_code: "TRP1111" } as Trigger])

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("3")
  })

  it("will ignore cases that are outside of the users organisation", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { court_date: dateToday },
      1: { court_date: dateToday },
      2: { court_date: dateToday, org_for_police_filter: "002" }
    })

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })

  it("will show 0 if there's matching case age", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, user)

    expect(caseMetadata.cases).toHaveLength(0)
    Object.keys(caseMetadata.caseAges).forEach((key) => {
      expect(caseMetadata.caseAges[key]).toBe("0")
    })
  })

  it("will ignore excluded triggers", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await createCases(helper.postgres, 3, {
      0: { court_date: dateToday, error_count: 0 },
      1: { court_date: dateToday, error_count: 0 },
      2: { court_date: dateToday, error_count: 0 }
    })
    await createTriggers(helper.postgres, 0, [
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0001 }
    ] as Trigger[])
    await createTriggers(helper.postgres, 1, [
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0010 }
    ] as Trigger[])
    await createTriggers(helper.postgres, 2, [
      { create_ts: new Date(), status: ResolutionStatusNumber.Unresolved, trigger_code: TriggerCode.TRPR0020 }
    ] as Trigger[])

    const caseMetadata = await fetchCasesAndFilter(helper.postgres, defaultQuery, userWithExcludedTrigger)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.caseAges[CaseAge.Today]).toBe("2")
  })
})
