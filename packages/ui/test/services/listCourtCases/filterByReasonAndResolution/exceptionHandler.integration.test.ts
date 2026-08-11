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
import { bailsTriggerCode, dummyExceptionCode, dummyTriggerCode, insertDummyData } from "./utils"

describe("Filter cases by resolution status for exceptionHandler user", () => {
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
      description:
        "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
      filters: {
        caseState: "Unresolved"
      },
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    },
    {
      description:
        "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
      filters: {
        caseState: "Resolved"
      },
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ]
    },
    {
      description:
        "Should see cases with unresolved exception when user is a exception handler and searches for HO100300",
      filters: {
        reasonCodes: [dummyExceptionCode]
      },
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Unresolved/Bails Trigger Unresolved",
        "Exceptions Unresolved/No triggers",
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved"
      ]
    },
    {
      description: "Should see no cases when filtering for resolved triggers as a exception handler",
      filters: {
        caseState: "Resolved",
        reason: Reason.Triggers
      },
      user: () => users.exceptionHandler,
      expectedCases: []
    },
    {
      description: "Should see no cases when filtering for unresolved triggers as a exception handler",
      filters: {
        caseState: "Unresolved",
        reason: Reason.Triggers
      },
      user: () => users.exceptionHandler,
      expectedCases: []
    },
    {
      description: "Should see resolved HO100300 exceptions when searching an exception code as an exception handler",
      filters: {
        caseState: "Resolved",
        reasonCodes: [dummyExceptionCode]
      },
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "Exceptions Resolved by generalHandler/No triggers",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ]
    },
    {
      description:
        "Should only see exception that has unresolved exception when searching a trigger code as an exception handler",
      filters: {
        caseState: "Unresolved",
        reasonCodes: [dummyTriggerCode, bailsTriggerCode]
      },
      user: () => users.exceptionHandler,
      expectedCases: ["Exceptions Unresolved/Trigger Unresolved", "Exceptions Unresolved/Bails Trigger Unresolved"]
    },
    {
      description:
        "Should only see exceptions that belong to a case which have a TRPR0001 trigger, when searching for trigger code TRPR0001 as an exception handler",
      filters: {
        caseState: "Resolved",
        reasonCodes: [dummyTriggerCode]
      },
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
        "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
        "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
      ]
    },
    {
      description: "Should only see unresolved exceptions when case state is not set as an exceptions handler",
      filters: {},
      user: () => users.exceptionHandler,
      expectedCases: [
        "Exceptions Unresolved/Trigger Resolved by someoneElse",
        "Exceptions Unresolved/Trigger Unresolved",
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
