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
        description:
          "Should see cases with unresolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: [Utils.dummyTriggerCode]
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: [Utils.dummyExceptionCode]
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ],
        filters: {
          reason: Reason.All,
          reasonCodes: [Utils.dummyExceptionCode, Utils.dummyTriggerCode]
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions and triggers when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "Exceptions Resolved by users.generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by users.generalHandler/No triggers",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by users.generalHandler",
          "No exceptions/Bails Trigger Resolved by users.generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.dummyExceptionCode, Utils.dummyTriggerCode]
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by users.generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by users.generalHandler/No triggers",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by users.generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.dummyExceptionCode]
        },
        user: () => users.generalHandler
      },
      {
        description: "Should see cases with resolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by users.generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by users.generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All,
          reasonCodes: [Utils.dummyTriggerCode]
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
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
        user: () => users.generalHandler
      },
      {
        description:
          "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/No triggers",
          "No exceptions/Bails Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.All
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should return cases with unresolved triggers when filtering for unresolved triggers as general handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Triggers
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should return cases with resolved triggers when filtering for resolved triggers as a general handler",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by users.generalHandler",
          "No exceptions/Bails Trigger Resolved by users.generalHandler"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Triggers
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should return cases with unresolved exceptions when filtering for unresolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: ResolutionStatus.Unresolved,
          reason: Reason.Exceptions
        },
        user: () => users.generalHandler
      },
      {
        description:
          "Should return cases with resolved exceptions when filtering for resolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by users.generalHandler/Trigger Resolved by users.generalHandler",
          "Exceptions Resolved by users.generalHandler/No triggers",
          "Exceptions Resolved by users.generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: ResolutionStatus.Resolved,
          reason: Reason.Exceptions
        },
        user: () => users.generalHandler
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a general handler",
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
        user: () => users.generalHandler
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
