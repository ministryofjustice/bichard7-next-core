import { isError } from "@moj-bichard7/common/types/Result"

import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import type { DataSource } from "typeorm"
import type { CaseListQueryParams } from "types/CaseListQueryParams"
import { Reason } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import deleteFromEntity from "../../../utils/deleteFromEntity"
import type { DummyDataUsers } from "./utils"
import { bailsTriggerCode, insertDummyData } from "./utils"

describe("Filter cases by resolution status for triggerHandler user", () => {
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
        "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
      filters: {
        caseState: "Unresolved"
      },
      user: () => users.triggerHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
        "Exceptions Unresolved/Bails Trigger Unresolved"
      ]
    },
    {
      description: "Should see cases with unresolved triggers when user is a trigger handler and searches for TRPR0010",
      filters: {
        reasonCodes: [bailsTriggerCode]
      },
      user: () => users.triggerHandler,
      expectedCases: ["Exceptions Unresolved/Bails Trigger Unresolved", "No exceptions/Bails Trigger Unresolved"]
    },
    {
      description: "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
      filters: {
        caseState: "Resolved"
      },
      user: () => users.triggerHandler,
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
      description: "Should see no cases when filtering for resolved exceptions as a trigger handler",
      filters: {
        caseState: "Resolved",
        reason: Reason.Exceptions
      },
      user: () => users.triggerHandler,
      expectedCases: []
    },
    {
      description: "Should see no cases when filtering for unresolved exceptions as a trigger handler",
      filters: {
        caseState: "Unresolved",
        reason: Reason.Exceptions
      },
      user: () => users.triggerHandler,
      expectedCases: []
    },
    {
      description: "Should see resolved TRPR0010 triggers when searching a bails trigger code as a trigger handler",
      filters: {
        caseState: "Resolved",
        reasonCodes: [bailsTriggerCode]
      },
      user: () => users.triggerHandler,
      expectedCases: [
        "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by generalHandler",
        "No exceptions/Bails Trigger Resolved by someoneElse",
        "No exceptions/Bails Trigger Resolved by triggerHandler"
      ]
    },
    {
      description: "Should only see unresolved triggers when case state is not set as a trigger handler",
      filters: {},
      user: () => users.triggerHandler,
      expectedCases: [
        "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
        "Exceptions Unresolved/Trigger Unresolved",
        "No exceptions/Bails Trigger Unresolved",
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
