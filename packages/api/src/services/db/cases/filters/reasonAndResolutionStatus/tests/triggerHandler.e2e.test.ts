import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import { sortBy } from "lodash"

import type { Filters, Pagination } from "../../../../../../types/CaseIndexQuerystring"

import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../../../tests/helpers/sort"
import fetchCasesAndFilter from "../../../../../../useCases/cases/getCases/fetchCasesAndFilter"
import * as Utils from "./utils"

describe("Filter cases by resolution status", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  const defaultQuery: Pagination = { maxPerPage: 25, pageNum: 1 }
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
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => users.triggerHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: [Utils.dummyTriggerCode]
        },
        user: () => users.triggerHandler
      },
      {
        description:
          "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => users.triggerHandler
      },
      {
        description: "Should see no cases when filtering for resolved exceptions as a trigger handler",
        expectedCases: [],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Exceptions
        },
        user: () => users.triggerHandler
      },
      {
        description:
          "Should only see cases with unresolved triggers when filtering for unresolved exceptions as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Exceptions
        },
        user: () => users.triggerHandler
      },
      {
        description: "Should see all resolved triggers when searching a bails trigger code as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.bailsTriggerCode]
        },
        user: () => users.triggerHandler
      },
      {
        description: "Should only see unresolved triggers when case state is not set as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => users.triggerHandler
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
