import type { DataSource, UpdateResult } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateCourtCaseAho from "../../src/services/updateCourtCaseAho"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.setTimeout(60 * 60 * 1000)

describe("update court case updated hearing outcome", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should update the court case `updated_msg` field in the db", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    await dataSource.getRepository(CourtCase).findOne({ where: { errorId: inputCourtCase.errorId } })

    const result = await updateCourtCaseAho(dataSource, inputCourtCase.errorId, "this_new_string")
    expect(isError(result)).toBe(false)

    const courtCaseRow = (result as UpdateResult).raw[0]
    expect(courtCaseRow.updated_msg).toBe("this_new_string")
    expect(courtCaseRow.user_updated_flag).toBe(1)
  })

  it("Should not update if the court case doesn't exist", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    const result = await updateCourtCaseAho(dataSource, inputCourtCase.errorId, "this_new_string")

    expect((result as UpdateResult).raw).toHaveLength(0)
    expect((result as UpdateResult).affected).toBe(0)
  })
})
