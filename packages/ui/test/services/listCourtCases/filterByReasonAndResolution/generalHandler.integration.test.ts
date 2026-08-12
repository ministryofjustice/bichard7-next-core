import { isError } from "@moj-bichard7/common/types/Result"

import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import type { DataSource } from "typeorm"
import { Reason, type CaseListQueryParams } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import deleteFromEntity from "../../../utils/deleteFromEntity"
import type { DummyDataUsers } from "./utils"
import { bailsTriggerCode, dummyExceptionCode, insertDummyData } from "./utils"

describe("Filter cases by resolution status for generalHandler user", () => {
  let dataSource: DataSource
  let users: DummyDataUsers = {} as DummyDataUsers

  beforeAll(async () => {
    dataSource = await getDataSource()
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
    users = await insertDummyData()
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  const testCases: {
    description: string
    filters: Partial<CaseListQueryParams>
    user: () => User
    expectedCases: string[]
  }[] = [
    {
      description: "Should see cases with unresolved triggers when user is a general handler and searches for TRPR0010",
      filters: {
        reasonCodes: [bailsTriggerCode]
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
        "No exceptions/Bails Trigger Unresolved"
      ]
    },
    {
      description:
        "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300",
      filters: {
        reasonCodes: [dummyExceptionCode]
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Unresolved/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved"
      ]
    },
    {
      description:
        "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300 and TRPR0010",
      filters: {
        reasonCodes: [dummyExceptionCode, bailsTriggerCode]
      },
      user: () => users.generalHandler,
      expectedCases: [
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
      ]
    },
    {
      description:
        "Should see cases with resolved exceptions and triggers when user is a general handler and searches for HO100300 and TRPR0010",
      filters: {
        reasonCodes: [dummyExceptionCode, bailsTriggerCode],
        caseState: "Resolved"
      },
      user: () => users.generalHandler,
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
      ]
    },
    {
      description: "Should see cases with resolved exceptions when user is a general handler and searches for HO100300",
      filters: {
        reasonCodes: [dummyExceptionCode],
        caseState: "Resolved"
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ]
    },
    {
      description: "Should see cases with resolved triggers when user is a general handler and searches for TRPR0010",
      filters: {
        reasonCodes: [bailsTriggerCode],
        caseState: "Resolved"
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ]
    },
    {
      description:
        "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
      filters: {
        caseState: "Unresolved"
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    },
    {
      description:
        "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
      filters: {
        caseState: "Resolved"
      },
      user: () => users.generalHandler,
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
      ]
    },
    {
      description:
        "Should return cases with unresolved triggers when filtering for unresolved triggers as general handler",
      filters: {
        caseState: "Unresolved",
        reason: Reason.Triggers
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    },
    {
      description:
        "Should return cases with resolved triggers when filtering for resolved triggers as a general handler",
      filters: {
        caseState: "Resolved",
        reason: Reason.Triggers
      },
      user: () => users.generalHandler,
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
      ]
    },
    {
      description:
        "Should return cases with unresolved exceptions when filtering for unresolved exceptions as a general handler",
      filters: {
        caseState: "Unresolved",
        reason: Reason.Exceptions
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    },
    {
      description:
        "Should return cases with resolved exceptions when filtering for resolved exceptions as a general handler",
      filters: {
        caseState: "Resolved",
        reason: Reason.Exceptions
      },
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ]
    },
    {
      description: "Should see unresolved triggers and exceptions when case state is not set as a general handler",
      filters: {},
      user: () => users.generalHandler,
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    }
  ]

  it.each(testCases)("$description", async ({ filters, user, expectedCases }) => {
    const result = await listCourtCases(dataSource, { maxPageItems: 100, ...filters }, user())

    expect(isError(result)).toBeFalsy()
    const { result: cases } = result as ListCourtCaseResult

    const defendantNames = cases.map((c) => c.defendantName).sort()

    expect(defendantNames).toStrictEqual(expectedCases.sort())
  })
})
