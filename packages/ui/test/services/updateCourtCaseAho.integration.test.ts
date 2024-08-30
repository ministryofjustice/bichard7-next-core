import { DataSource, UpdateResult } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import updateCourtCaseAho from "../../src/services/updateCourtCaseAho"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import deleteFromEntity from "../utils/deleteFromEntity"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"

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

    const result = await updateCourtCaseAho(dataSource, inputCourtCase.errorId, "this_new_string", true)
    expect(isError(result)).toBe(false)

    const courtCaseRow = (result as UpdateResult).raw[0]
    expect(courtCaseRow.updated_msg).toEqual("this_new_string")
    expect(courtCaseRow.user_updated_flag).toBe(1)
  })

  it("Should not update the `user_updated_flag` field in the db", async () => {
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

    const result = await updateCourtCaseAho(dataSource, inputCourtCase.errorId, "", false)
    expect(isError(result)).toBe(false)

    const courtCaseRow = (result as UpdateResult).raw[0]
    expect(courtCaseRow.updated_msg).toEqual("")
    expect(courtCaseRow.user_updated_flag).toBe(0)
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

    const result = await updateCourtCaseAho(dataSource, inputCourtCase.errorId, "this_new_string", true)

    expect((result as UpdateResult).raw).toHaveLength(0)
    expect((result as UpdateResult).affected).toBe(0)
  })
})
