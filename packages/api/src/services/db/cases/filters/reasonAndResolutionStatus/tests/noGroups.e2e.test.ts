import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../../../tests/helpers/sort"
import * as Utils from "./utils"

describe("Filter cases by resolution status using no groups user", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let users: Utils.DummyDataUsers

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    users = await Utils.insertDummyData(helper)
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  const testCases: {
    description: string
    expectedCases: string[]
    filters: Filters
    user: () => User
  }[] = [
    {
      description: "Shouldn't show cases to a user with no permissions",
      expectedCases: [],
      filters: {
        reason: Reason.All
      },
      user: () => users.noGroupsUser
    },
    {
      description: "Shouldn't show cases to a user with no permissions when a reason filter is passed",
      expectedCases: [],
      filters: {
        reason: Reason.Triggers
      },
      user: () => users.noGroupsUser
    }
  ]

  it.each(testCases)("$description", async ({ expectedCases, filters, user }) => {
    const defendantNames = await Utils.applyFilter(filters, user, helper)

    const sortedExpectedCases = sortStringAsc(expectedCases)

    expect(defendantNames).toStrictEqual(sortedExpectedCases)
  })
})
