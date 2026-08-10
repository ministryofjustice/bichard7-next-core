import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../../../tests/helpers/sort"
import * as Utils from "./utils"

describe("Filter cases by resolution status", () => {
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

  const testCases: {
    description: string
    expectedCases: string[]
    filters: Filters
    user: () => User
  }[] = [
    {
      description:
        "Should see all cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ],
      filters: {
        caseState: ResolutionStatus.Unresolved,
        reason: Reason.All
      },
      user: () => users.exceptionHandler
    },
    {
      description:
        "Should see all cases with resolved exceptions when user is an exception handler and resolved filter applied",
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
        reason: Reason.All
      },
      user: () => users.exceptionHandler
    },
    {
      description:
        "Should see all cases with unresolved HO100300 exception when user is a exception handler and searches for HO100300",
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
      user: () => users.exceptionHandler
    },
    {
      description: "Should see no cases when filtering for resolved triggers as a exception handler",
      expectedCases: [],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.Triggers
      },
      user: () => users.exceptionHandler
    },
    {
      description: "Should see no cases when filtering for unresolved triggers as a exception handler",
      expectedCases: [],
      filters: {
        caseState: ResolutionStatus.Unresolved,
        reason: Reason.Triggers
      },
      user: () => users.exceptionHandler
    },
    {
      description:
        "Should see all resolved HO100300 exceptions when searching an exception code as an exception handler with reason code HO100300",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
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
      user: () => users.exceptionHandler
    },
    {
      description:
        "Should only see exception that has unresolved exception when searching a trigger code as an exception handler",
      expectedCases: ["Exceptions Unresolved/Trigger Unresolved", "Exceptions Unresolved/Bails Trigger Unresolved"],
      filters: {
        caseState: ResolutionStatus.Unresolved,
        reason: Reason.All,
        reasonCodes: [Utils.dummyTriggerCode, Utils.bailsTriggerCode]
      },
      user: () => users.exceptionHandler
    },
    {
      description: "Should see all resolved exceptions when searching a trigger code as an exception handler",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.All,
        reasonCodes: [Utils.dummyTriggerCode]
      },
      user: () => users.exceptionHandler
    },
    {
      description: "Should only see unresolved exceptions when case state is not set as an exceptions handler",
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ],
      filters: {
        reason: Reason.All
      },
      user: () => users.exceptionHandler
    }
  ]

  it.each(testCases)("$description", async ({ expectedCases, filters, user }) => {
    const defendantNames = await Utils.applyFilter(filters, user, helper)

    const sortedExpectedCases = sortStringAsc(expectedCases)

    console.log(defendantNames)
    console.log(sortedExpectedCases)

    expect(defendantNames).toStrictEqual(sortedExpectedCases)
  })
})
