import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

const orgCodes = ["36", "36F", "36FP", "36FPA", "36FPA1", "36FQ", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC"]

describe("courtCaseByVisibleForcesQuery", () => {
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

  it("Should remove a leading 0 from a the users visible force", async () => {
    const expectedPtiurn = "0123"
    await insertCourtCasesWithFields([{ orgForPoliceFilter: "93YZ", ptiurn: expectedPtiurn }])

    const result = await courtCasesByVisibleForcesQuery(query, ["093"])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(1)
    expect(cases[0].ptiurn).toEqual(expectedPtiurn)
  })

  it("Should return a list of cases for the force code", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await courtCasesByVisibleForcesQuery(query, ["36"])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(6)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36    ", "36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 2, 3, 4, 5]))
  })

  it("Should show cases for all forces visible to a user", async () => {
    const orgCodesForAllVisibleForces = [
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ]

    await insertCourtCasesWithFields(orgCodesForAllVisibleForces.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await courtCasesByVisibleForcesQuery(query, ["36", "13"])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(12)

    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36FP  ", "36FPA ", "36FPA1", "13GH  ", "13GHA ", "13GHA1", "13GHB ", "13GHBA"])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([2, 3, 4, 13, 14, 15, 16, 17]))
  })

  it("Should show no cases to a user with no visible forces", async () => {
    const orgCodesForNoVisibleCases = [
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ]
    await insertCourtCasesWithFields(orgCodesForNoVisibleCases.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await courtCasesByVisibleForcesQuery(query, [])
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("Should update visible cases when its an update query", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithFields(orgCodesForVisibleForceLen5.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const updateQuery = query.update(CourtCase)

    const result = await courtCasesByVisibleForcesQuery(updateQuery, ["12"])
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(7)
  })
})
