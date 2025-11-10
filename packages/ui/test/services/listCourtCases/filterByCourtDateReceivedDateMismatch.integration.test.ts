import type { DataSource } from "typeorm"
import type User from "../../../src/services/entities/User"
import getDataSource from "../../../src/services/getDataSource"
import deleteFromEntity from "../../utils/deleteFromEntity"
import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import Note from "../../../src/services/entities/Note"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import listCourtCases from "../../../src/services/listCourtCases"
import { isError } from "@moj-bichard7/common/types/Result"
import type { ListCourtCaseResult } from "../../../src/types/ListCourtCasesResult"

describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const forceCode = "036"
  let testUser: User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)

    testUser = {
      visibleForces: [forceCode],
      visibleCourts: [],
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should filter cases with different court date and message received date", async () => {
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2008-03-26")
    const fourthDate = new Date("2013-10-16")

    await insertCourtCasesWithFields([
      { courtDate: firstDate, messageReceivedTimestamp: firstDate, orgForPoliceFilter: orgCode },
      { courtDate: secondDate, messageReceivedTimestamp: secondDate, orgForPoliceFilter: orgCode },
      { courtDate: secondDate, messageReceivedTimestamp: thirdDate, orgForPoliceFilter: orgCode },
      { courtDate: thirdDate, messageReceivedTimestamp: fourthDate, orgForPoliceFilter: orgCode }
    ])

    const result = await listCourtCases(
      dataSource,
      {
        maxPageItems: 100,
        courtDateReceivedDateMismatch: true
      },
      testUser
    )

    expect(isError(result)).toBeFalsy()
    const { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(2)
  })
})
