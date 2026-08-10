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
      description: "Should see cases with unresolved TRPR0010 triggers when searching with reason code TRPR0010",
      expectedCases: ["Exceptions Unresolved/Bails Trigger Unresolved", "No exceptions/Bails Trigger Unresolved"],
      filters: {
        reason: Reason.All,
        reasonCodes: [Utils.bailsTriggerCode]
      },
      user: () => users.generalHandler
    },
    {
      description: "Should see unresolved HO100300 exceptions when searching with reason code HO100300",
      expectedCases: [
        "Exceptions Unresolved/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved"
      ],
      filters: {
        reason: Reason.All,
        reasonCodes: [Utils.dummyExceptionCode1]
      },
      user: () => users.generalHandler
    },
    {
      description: "Should see unresolved HO100300 exceptions when searching with reason code HO100300 and TRPR0010",
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
        reasonCodes: [Utils.dummyExceptionCode1, Utils.bailsTriggerCode]
      },
      user: () => users.generalHandler
    },
    {
      description:
        "Should see resolved exceptions and triggers when searching with reason code HO100300 and TRPR0010 and resolution status set to resolved",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.All,
        reasonCodes: [Utils.dummyExceptionCode1, Utils.bailsTriggerCode]
      },
      user: () => users.generalHandler
    },
    {
      description:
        "Should see resolved exceptions when searching with reason code HO100300 and resolution status set to resolved",
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
        reasonCodes: [Utils.dummyExceptionCode1]
      },
      user: () => users.generalHandler
    },
    {
      description:
        "Should see resolved triggers when searching with reason code TRPR0010 and resolution status set to resolved",
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
      user: () => users.generalHandler
    },
    {
      description: "Should see unresolved triggers or unresolved exceptions when resolution status set to unresolved",
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
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
      description: "Should see resolved triggers and exceptions when resolution status set to resolved",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.All
      },
      user: () => users.generalHandler
    },
    {
      description: "Should see unresolved triggers when resolution status set to unresolved",
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
      description: "Should see resolved triggers when resolution status set to resolved and reason set to triggers",
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ],
      filters: {
        caseState: ResolutionStatus.Resolved,
        reason: Reason.Triggers
      },
      user: () => users.generalHandler
    },
    {
      description:
        "Should see unresolved exceptions when resolution status set to unresolved and reason set to exceptions",
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
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
      description: "Should see resolved exceptions when resolution status set to resolved and reason set to exceptions",
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
        reason: Reason.Exceptions
      },
      user: () => users.generalHandler
    },
    {
      description: "Should see unresolved triggers and exceptions when case state is not set",
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
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
    const defendantNames = await Utils.applyFilter(filters, user, helper)

    const sortedExpectedCases = sortStringAsc(expectedCases)

    expect(defendantNames).toStrictEqual(sortedExpectedCases)
  })
})
