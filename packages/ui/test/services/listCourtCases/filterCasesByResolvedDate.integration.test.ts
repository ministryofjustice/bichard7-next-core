import type User from "services/entities/User"
import type { DataSource } from "typeorm"
import type { DateRange } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"

import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"

import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)

describe("Filter cases by resolved date", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const forceCode = "036"
  const testUser = {
    hasAccessTo: hasAccessToAll,
    visibleCourts: [],
    visibleForces: [forceCode]
  } as Partial<User> as User

  const insertDummyCourtCases = async (courtCasesCount: number) => {
    await insertCourtCasesWithFields(
      Array.from(Array(courtCasesCount)).map((_, index) => ({
        errorResolvedTimestamp: new Date(`2024-05-0${index + 1}`),
        errorStatus: "Resolved",
        orgForPoliceFilter: orgCode,
        resolutionTimestamp: new Date(`2024-05-0${index + 1}`),
        triggerResolvedTimestamp: new Date(`2024-05-0${index + 1}`)
      }))
    )
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
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

  it("Returns resolved cases within given date range", async () => {
    const resolvedDateRange = {
      from: new Date("2024-05-03 00:00:.000"),
      to: new Date("2024-05-05 23:59:59.000")
    } as DateRange
    await insertDummyCourtCases(8)

    const { result, totalCases } = (await listCourtCases(
      dataSource,
      { caseState: "Resolved", resolvedDateRange },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(3)
    expect(totalCases).toBe(3)
    expect(result[0].resolutionTimestamp?.toString()).toBe(new Date("2024-05-03").toString())
    expect(result[1].resolutionTimestamp?.toString()).toBe(new Date("2024-05-04").toString())
    expect(result[2].resolutionTimestamp?.toString()).toBe(new Date("2024-05-05").toString())
  })

  it("Returns all cases resolved after 'from' if 'to' is ommitted", async () => {
    const resolvedDateRange = {
      from: new Date("2024-05-05 00:00:.000")
    } as DateRange
    await insertDummyCourtCases(8)

    const { result, totalCases } = (await listCourtCases(
      dataSource,
      { caseState: "Resolved", resolvedDateRange },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(4)
    expect(totalCases).toBe(4)
    expect(result[0].resolutionTimestamp?.toString()).toBe(new Date("2024-05-05").toString())
    expect(result[1].resolutionTimestamp?.toString()).toBe(new Date("2024-05-06").toString())
    expect(result[2].resolutionTimestamp?.toString()).toBe(new Date("2024-05-07").toString())
    expect(result[3].resolutionTimestamp?.toString()).toBe(new Date("2024-05-08").toString())
  })

  it("Returns all cases resolved before 'to' if 'from' is ommitted", async () => {
    const resolvedDateRange = {
      to: new Date("2024-05-05 23:59:59.000")
    } as DateRange
    await insertDummyCourtCases(8)

    const { result, totalCases } = (await listCourtCases(
      dataSource,
      { caseState: "Resolved", resolvedDateRange },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(5)
    expect(totalCases).toBe(5)
    expect(result[0].resolutionTimestamp?.toString()).toBe(new Date("2024-05-01").toString())
    expect(result[1].resolutionTimestamp?.toString()).toBe(new Date("2024-05-02").toString())
    expect(result[2].resolutionTimestamp?.toString()).toBe(new Date("2024-05-03").toString())
    expect(result[3].resolutionTimestamp?.toString()).toBe(new Date("2024-05-04").toString())
    expect(result[4].resolutionTimestamp?.toString()).toBe(new Date("2024-05-05").toString())
  })

  it("Returns all cases resolved if both 'from' and 'to' are ommitted", async () => {
    const resolvedDateRange = {} as DateRange
    await insertDummyCourtCases(8)

    const { result, totalCases } = (await listCourtCases(
      dataSource,
      { caseState: "Resolved", resolvedDateRange },
      testUser
    )) as ListCourtCaseResult

    expect(result).toHaveLength(8)
    expect(totalCases).toBe(8)
    expect(result[0].resolutionTimestamp?.toString()).toBe(new Date("2024-05-01").toString())
    expect(result[1].resolutionTimestamp?.toString()).toBe(new Date("2024-05-02").toString())
    expect(result[2].resolutionTimestamp?.toString()).toBe(new Date("2024-05-03").toString())
    expect(result[3].resolutionTimestamp?.toString()).toBe(new Date("2024-05-04").toString())
    expect(result[4].resolutionTimestamp?.toString()).toBe(new Date("2024-05-05").toString())
    expect(result[5].resolutionTimestamp?.toString()).toBe(new Date("2024-05-06").toString())
    expect(result[6].resolutionTimestamp?.toString()).toBe(new Date("2024-05-07").toString())
    expect(result[7].resolutionTimestamp?.toString()).toBe(new Date("2024-05-08").toString())
  })
})
