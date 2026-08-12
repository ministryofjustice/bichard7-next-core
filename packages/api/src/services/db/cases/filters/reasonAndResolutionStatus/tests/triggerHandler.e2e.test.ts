import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { sortStringAsc } from "../../../../../../tests/helpers/sort"
import * as Utils from "./utils.test"

describe("Filter cases by resolution status for triggerHandler user", () => {
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
      description: "Should see unresolved triggers when resolution status set to unresolved and reason set to all",
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
      description: "Should see unresolved TRPR0010 triggers when searching for reason code TRPR0010",
      expectedCases: ["Exceptions Unresolved/Bails Trigger Unresolved", "No exceptions/Bails Trigger Unresolved"],
      filters: {
        reason: Reason.All,
        reasonCodes: [Utils.bailsTriggerCode]
      },
      user: () => users.triggerHandler
    },
    {
      description:
        "Should see resolved TRPR0010 triggers when searching for reason code TRPR0010 and resolution status set to resolved, reason set to all",
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
      description: "Should see resolved triggers when resolution status set to resolved and reason set to all",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "No exceptions/Bails Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.All
      },
      user: () => users.triggerHandler
    },
    {
      description: "Should see no cases when filtering for resolved exceptions",
      expectedCases: [],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.Exceptions
      },
      user: () => users.triggerHandler
    },
    {
      description: "Should see no cases when filtering for unresolved exceptions",
      expectedCases: [],
      filters: {
        caseState: ResolutionStatus.Unresolved,
        reason: Reason.Exceptions
      },
      user: () => users.triggerHandler
    },
    {
      description:
        "Should see unresolved triggers when searching with reason codes HO100300 and H0100332, resolution status set to unresolved and reason set to all",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Bails Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved"
      ],
      filters: {
        caseState: ResolutionStatus.Unresolved,
        reason: Reason.All,
        reasonCodes: [Utils.dummyExceptionCode1, Utils.dummyExceptionCode2]
      },
      user: () => users.triggerHandler
    },
    {
      description:
        "Should see resolved triggers when searching with reason codes HO100300 and H0100332, resolution status set to resolved and reason set to all",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
        "Exceptions Unresolved/Trigger Resolved by someoneElse"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.All,
        reasonCodes: [Utils.dummyExceptionCode1, Utils.dummyExceptionCode2]
      },
      user: () => users.triggerHandler
    },
    {
      description: "Should see unresolved triggers when case state is not set and reason set to all",
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
    const defendantNames = await Utils.applyFilter(filters, user, helper)

    const sortedExpectedCases = sortStringAsc(expectedCases)

    expect(defendantNames).toStrictEqual(sortedExpectedCases)
  })
})
