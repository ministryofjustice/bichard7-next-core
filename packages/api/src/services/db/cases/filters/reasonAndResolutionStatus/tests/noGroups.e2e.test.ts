import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { sortBy } from "lodash"

import type { Filters, Pagination } from "../../../../../../types/CaseIndexQuerystring"

import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../../../tests/helpers/sort"
import fetchCasesAndFilter from "../../../../../../useCases/cases/getCases/fetchCasesAndFilter"
import * as Utils from "./utils"

describe("Filter cases by resolution status", () => {
  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let users: Utils.DummyDataUsers

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    users = await Utils.insertDummyData(helper, app)
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  describe("Filter cases having by resolution status, reason code and user permission", () => {
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
      const result = (await fetchCasesAndFilter(
        helper.postgres.readonly,
        { ...filters, ...defaultQuery },
        user()
      )) as CaseIndexMetadata

      const cases = result.cases

      const defendantNames = sortBy(cases, "defendantName").map((c) => c.defendantName)
      const sortedExpectedCases = sortStringAsc(expectedCases)

      console.log("received", defendantNames)
      console.log("sortedExpectedCases", sortedExpectedCases)

      expect(defendantNames).toStrictEqual(sortedExpectedCases)
    })
  })
})
