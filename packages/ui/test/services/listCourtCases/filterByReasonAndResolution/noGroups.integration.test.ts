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
import { insertDummyData } from "./utils"

describe("Filter cases by resolution status for no groups user", () => {
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
      description: "Shouldn't show cases to a user with no permissions",
      filters: {},
      user: () => users.noGroupsUser,
      expectedCases: []
    },
    {
      description: "Shouldn't show cases to a user with no permissions when a reason filter is passed",
      filters: {
        reason: Reason.Triggers
      },
      user: () => users.noGroupsUser,
      expectedCases: []
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
