import CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import type { DataSource } from "typeorm"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { isError } from "../../../src/types/Result"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import Trigger from "../../../src/services/entities/Trigger"
import Note from "services/entities/Note"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const forceCode = "036"
  const testUser = {
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User

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

  describe("search by resolvedByUsername", () => {
    it("Should list cases that match the partial username search", async () => {
      await insertCourtCasesWithFields([
        { errorResolvedBy: "User Name01" },
        { triggerResolvedBy: "User Name02" },
        { errorResolvedBy: "User Name03" }
      ])

      const result = await listCourtCases(dataSource, { maxPageItems: 100, resolvedByUsername: "User" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorResolvedBy).toBe("User Name01")
      expect(cases[1].triggerResolvedBy).toBe("User Name02")
      expect(cases[2].errorResolvedBy).toBe("User Name03")
    })

    it("Should list cases that match the full username search", async () => {
      await insertCourtCasesWithFields([
        { errorResolvedBy: "User Name01" },
        { triggerResolvedBy: "User Name02" },
        { errorResolvedBy: "User Name03" }
      ])

      const result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, resolvedByUsername: "User Name01" },
        testUser
      )
      expect(isError(result)).toBe(false)
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorResolvedBy).toBe("User Name01")
    })

    it("Should handle wildcard searches for partial usernames", async () => {
      await insertCourtCasesWithFields([
        { errorResolvedBy: "User Name01" },
        { triggerResolvedBy: "User Name02" },
        { errorResolvedBy: "User Name03" }
      ])

      const result = await listCourtCases(dataSource, { maxPageItems: 100, resolvedByUsername: "%Name0%" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorResolvedBy).toBe("User Name01")
      expect(cases[1].triggerResolvedBy).toBe("User Name02")
      expect(cases[2].errorResolvedBy).toBe("User Name03")
    })
  })
})
