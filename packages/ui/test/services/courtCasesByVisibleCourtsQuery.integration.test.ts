import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import courtCasesByVisibleCourtsQuery from "services/queries/courtCasesByVisibleCourtsQuery"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("courtCasesByVisibleCourtsQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should return a list of cases when the court code is an exact match", async () => {
    const courtCodes = ["3", "36", "36AAAA"]
    await insertCourtCasesWithFields(courtCodes.map((courtCode) => ({ courtCode: courtCode })))

    const result = await courtCasesByVisibleCourtsQuery(query, ["36AAAA"])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(1)
    expect(cases[0].errorId).toEqual(2)
    expect(cases[0].courtCode).toEqual("36AAAA")
  })

  it("Should show cases for all courts visible to a user where the beginning of the code matches", async () => {
    const courtCodesForVisibleCourts = ["36F   ", "36FP  ", "13GH  ", "13GHA "]
    const otherCourtCodes = ["36", "13", "12LK"]

    await insertCourtCasesWithFields(
      courtCodesForVisibleCourts.concat(otherCourtCodes).map((courtCode) => ({ courtCode: courtCode }))
    )

    const result = await courtCasesByVisibleCourtsQuery(query, ["36F", "13GH"])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases.map((c) => c.courtCode)).toEqual(expect.arrayContaining(courtCodesForVisibleCourts))
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 2, 3]))
  })

  it("Should show no cases to a user with no visible courts", async () => {
    const courtCodesForNoVisibleCases = ["36", "36F", "36FP", "36FPA"]
    await insertCourtCasesWithFields(courtCodesForNoVisibleCases.map((courtCode) => ({ courtCode: courtCode })))

    const result = await courtCasesByVisibleCourtsQuery(query, [])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("Should update visible cases when its an update query", async () => {
    const courtCodesForVisibleCourts = ["013", "013A", "013B", "014"]
    await insertCourtCasesWithFields(courtCodesForVisibleCourts.map((courtCode) => ({ courtCode: courtCode })))

    const updateQuery = query.update(CourtCase)

    const result = await courtCasesByVisibleCourtsQuery(updateQuery, ["013"])
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(3)
  })
})
