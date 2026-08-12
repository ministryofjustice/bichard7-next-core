import { isError } from "@moj-bichard7/common/types/Result"

import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import type { DataSource } from "typeorm"
import type { CaseListQueryParams } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import deleteFromEntity from "../../../utils/deleteFromEntity"
import type { DummyDataUsers } from "./utils"
import { bailsTriggerCode, dummyExceptionCode, insertDummyData } from "./utils"

describe("Filter cases by resolution status for supervisor user", () => {
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
      description: "Should see all cases with resolved triggers when user is a supervisor and searches for TRPR0010",
      filters: {
        reasonCodes: [bailsTriggerCode],
        caseState: "Resolved"
      },
      user: () => users.supervisor,
      expectedCases: [
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ]
    },
    {
      description: "Should see all cases with resolved exceptions when user is a supervisor and searches for HO100300",
      filters: {
        reasonCodes: [dummyExceptionCode],
        caseState: "Resolved"
      },
      user: () => users.supervisor,
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
      description:
        "Should see cases with unresolved triggers or unresolved exceptions when user is a supervisor and resolved filter applied",
      filters: {
        caseState: "Unresolved"
      },
      user: () => users.supervisor,
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
        "Should see cases with triggers and exceptions, resolved by anyone when user is a supervisor and resolved filter applied",
      filters: {
        caseState: "Resolved"
      },
      user: () => users.supervisor,
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
      ]
    },
    {
      description: "Should see unresolved triggers and exceptions when case state is not set as a supervisor",
      filters: {},
      user: () => users.supervisor,
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
