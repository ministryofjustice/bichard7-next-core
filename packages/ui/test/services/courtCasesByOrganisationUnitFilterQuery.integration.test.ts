import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import courtCasesByVisibleCourtsQuery from "services/queries/courtCasesByVisibleCourtsQuery"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

jest.mock("services/queries/courtCasesByVisibleCourtsQuery")
jest.mock("services/queries/courtCasesByVisibleForcesQuery")

describe("courtCasesByOrganisationUnitQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(courtCasesByVisibleCourtsQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByVisibleCourtsQuery").default
    )
    ;(courtCasesByVisibleForcesQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByVisibleForcesQuery").default
    )
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should call both visible courts and visible forces queries", async () => {
    const dummyForceCode = "001"
    const dummyCourtCode = "01XY01"
    const user: Partial<User> = {
      visibleForces: [dummyForceCode],
      visibleCourts: [dummyCourtCode]
    }

    courtCasesByOrganisationUnitQuery(query, user as User)

    expect(courtCasesByVisibleCourtsQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleCourtsQuery).toHaveBeenCalledWith(expect.any(Object), [dummyCourtCode])

    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledWith(expect.any(Object), [dummyForceCode])
  })

  it("Should select all visible cases when its a select query", async () => {
    const expectedOrgCodes = ["12GHA ", "12GHAB", "13BR  ", "14AT  "]
    const otherOrgCodes = ["15AA", "16AA"]
    const user: Partial<User> = {
      visibleForces: ["012"],
      visibleCourts: ["13BR", "14AT"]
    }
    await insertCourtCasesWithFields(
      expectedOrgCodes.concat(otherOrgCodes).map((orgCode) => ({ orgForPoliceFilter: orgCode, courtCode: orgCode }))
    )

    const result = await courtCasesByOrganisationUnitQuery(query, user as User)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]
    expect(cases).toHaveLength(4)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(expect.arrayContaining(expectedOrgCodes))
    expect(cases.map((c) => c.courtCode)).toEqual(expect.arrayContaining(expectedOrgCodes))
  })

  it("Should update visible cases when its an update query", async () => {
    const expectedOrgCodes = ["12GHA ", "12GHAB", "13BR  "]
    const otherOrgCodes = ["14AT  ", "15AA", "16AA"]
    const user: Partial<User> = {
      visibleForces: ["012"],
      visibleCourts: ["13BR"]
    }
    await insertCourtCasesWithFields(
      expectedOrgCodes.concat(otherOrgCodes).map((orgCode) => ({ orgForPoliceFilter: orgCode, courtCode: orgCode }))
    )

    const updateQuery = query.update(CourtCase)

    const result = await courtCasesByOrganisationUnitQuery(updateQuery, user as User)
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(3)
  })
})
