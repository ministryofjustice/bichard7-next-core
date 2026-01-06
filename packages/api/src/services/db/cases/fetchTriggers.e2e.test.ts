import type { Case } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { sortBy } from "lodash"

import type { Filters } from "../../../types/CaseIndexQuerystring"

import { createCases } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../tests/helpers/userHelper"
import fetchTriggers from "./fetchTriggers"

describe("fetchTriggers e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User
  let user2: User
  let cases: Case[]

  const defaultFilter: Filters = { reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    const users = await createUsers(helper.postgres, 2, {
      0: { excludedTriggers: [] },
      1: { excludedTriggers: [TriggerCode.TRPR0001, TriggerCode.TRPR0010] }
    })

    user = users[0]
    user2 = users[1]
    cases = await createCases(helper.postgres, 2)

    await createTriggers(helper.postgres, cases[0].errorId, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0001 },
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0005 },
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0010 },
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPS0010 }
    ] as Trigger[])

    await createTriggers(helper.postgres, cases[1].errorId, [
      { createdAt: new Date(), status: ResolutionStatusNumber.Unresolved, triggerCode: TriggerCode.TRPR0001 }
    ] as Trigger[])
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will get all triggers by case IDs", async () => {
    const triggers = await fetchTriggers(
      helper.postgres.readonly,
      user,
      cases.map((c) => c.errorId),
      defaultFilter
    )

    expect(triggers).toHaveLength(5)
  })

  it("will get all triggers based on one case", async () => {
    const triggers = await fetchTriggers(helper.postgres.readonly, user, [cases[0].errorId], defaultFilter)

    expect(triggers).toHaveLength(4)
  })

  it("will get triggers that match the trigger code in reason codes only", async () => {
    const triggers = (await fetchTriggers(
      helper.postgres.readonly,
      user,
      cases.map((c) => c.errorId),
      { reasonCodes: [TriggerCode.TRPR0001], ...defaultFilter }
    )) as Trigger[]

    expect(triggers).toHaveLength(2)
    expect(sortBy(triggers, "errorId").map((t) => t.errorId)).toEqual([0, 1])
  })

  it("will get triggers that match the trigger codes in reason codes only", async () => {
    const triggers = (await fetchTriggers(
      helper.postgres.readonly,
      user,
      cases.map((c) => c.errorId),
      { reasonCodes: [TriggerCode.TRPR0001, TriggerCode.TRPS0010], ...defaultFilter }
    )) as Trigger[]

    expect(triggers).toHaveLength(3)
    expect(sortBy(triggers, "errorId").map((t) => t.errorId)).toEqual([0, 0, 1])
  })

  it("will filter out triggers if the user has excluded them", async () => {
    const triggers = (await fetchTriggers(
      helper.postgres.readonly,
      user2,
      cases.map((c) => c.errorId),
      defaultFilter
    )) as Trigger[]

    expect(triggers).toHaveLength(2)
    expect(sortBy(triggers, "errorId").map((t) => t.errorId)).toEqual([0, 0])
    expect(sortBy(triggers, "triggerCode").map((t) => t.triggerCode)).toEqual([
      TriggerCode.TRPR0005,
      TriggerCode.TRPS0010
    ])
  })
})
