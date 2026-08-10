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
        description: "Should see all cases with resolved triggers when user is a supervisor and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.dummyTriggerCode]
        },
        user: () => users.supervisor
      },
      {
        description:
          "Should see all cases with resolved exceptions when user is a supervisor and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.dummyExceptionCode]
        },
        user: () => users.supervisor
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a supervisor and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.All
        },
        user: () => users.supervisor
      },
      {
        description:
          "Should see cases with triggers and exceptions, resolved by anyone when user is a supervisor and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => users.supervisor
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a supervisor",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All
        },
        user: () => users.supervisor
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
