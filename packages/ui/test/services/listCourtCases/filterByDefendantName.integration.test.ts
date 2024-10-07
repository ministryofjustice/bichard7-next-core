import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { isError } from "../../../src/types/Result"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

describe("search by defendant name", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const forceCode = "036"
  const testUser = {
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User

  const defendantToInclude = "WAYNE Bruce"
  const defendantToIncludeWithPartialMatch = "WAYNE Bill"
  const defendantToNotInclude = "GORDON Barbara"
  const defendantToNotIncludeSecond = "WAYNE Alfred"

  beforeAll(async () => {
    dataSource = await getDataSource()
    await deleteFromEntity(CourtCase)

    await insertCourtCasesWithFields([
      { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
      { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
      { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
      { defendantName: defendantToNotIncludeSecond, orgForPoliceFilter: orgCode }
    ])
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
    ;(leftJoinAndSelectTriggersQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/leftJoinAndSelectTriggersQuery").default
    )
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("will match cases when the defendant name is case insensitive", async () => {
    let result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "wayne Bruce" }, testUser)
    expect(isError(result)).toBe(false)
    let { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(1)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)

    result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "WAYNE Bruce" }, testUser)
    expect(isError(result)).toBe(false)
    cases = (result as ListCourtCaseResult).result

    expect(cases).toHaveLength(1)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
  })

  it("will match cases with wildcard match", async () => {
    const result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "WAYNE B" }, testUser)
    expect(isError(result)).toBe(false)
    const cases = (result as ListCourtCaseResult).result

    expect(cases).toHaveLength(2)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
  })

  it("will match cases with user entered wildcard", async () => {
    let result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "wa*b" }, testUser)
    expect(isError(result)).toBe(false)
    let cases = (result as ListCourtCaseResult).result

    expect(cases).toHaveLength(2)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)

    result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "wa*b*" }, testUser)
    expect(isError(result)).toBe(false)
    cases = (result as ListCourtCaseResult).result

    expect(cases).toHaveLength(2)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
    expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)

    result = await listCourtCases(dataSource, { maxPageItems: 100, defendantName: "wa*br*" }, testUser)
    expect(isError(result)).toBe(false)
    cases = (result as ListCourtCaseResult).result

    expect(cases).toHaveLength(1)
    expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
  })
})
