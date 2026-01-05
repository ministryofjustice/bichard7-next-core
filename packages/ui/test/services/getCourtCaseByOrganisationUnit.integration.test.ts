import type { DataSource } from "typeorm"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import Trigger from "services/entities/Trigger"
import type User from "services/entities/User"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import CourtCase from "services/entities/CourtCase"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import { isError } from "types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

describe("getCourtCaseByOrganisationUnits", () => {
  let dataSource: DataSource
  const courtCode = "36FPA1"
  const forceCode = "036"

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(leftJoinAndSelectTriggersQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/leftJoinAndSelectTriggersQuery").default
    )
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("Test different roles", () => {
    it("fetches case if user is a supervisor", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " ")
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.Supervisor]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect(result).toStrictEqual(inputCourtCase)
    })

    it("returns null if user in no groups", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " ")
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.NewUI]
      } as Partial<User> as User)

      expect(result).toBeNull()
    })

    it("fetches the case if the user is an exception handler and the case has unresolved exceptions", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        errorCount: 1
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.ExceptionHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect(result).toStrictEqual(inputCourtCase)
    })

    it("fetches the case if the user is an exception handler and the case has been resolved by them", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        errorCount: 1,
        errorResolvedBy: "ExceptionHandler",
        errorStatus: ResolutionStatus.Resolved
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        username: "ExceptionHandler",
        groups: [UserGroup.ExceptionHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect(result).toStrictEqual(inputCourtCase)
    })

    it("returns null if the user is an exception handler but the case has been resolved by another user", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        errorCount: 1,
        errorResolvedBy: "AnotherUser",
        errorStatus: ResolutionStatus.Resolved
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        username: "ExceptionHandler",
        groups: [UserGroup.ExceptionHandler]
      } as Partial<User> as User)

      expect(result).toBeNull()
    })

    it("returns null if the user is an exception handler but the case has no exceptions", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        errorCount: 0
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.ExceptionHandler]
      } as Partial<User> as User)

      expect(result).toBeNull()
    })

    it("fetches the case if the user is a trigger handler and the case has unresolved triggers", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        triggerStatus: ResolutionStatus.Unresolved,
        triggers: [
          {
            triggerCode: TriggerCode.TRPR0001,
            status: ResolutionStatus.Unresolved,
            createdAt: new Date()
          } as unknown as Trigger
        ]
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.TriggerHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect((result as CourtCase).errorId).toBe(inputCourtCase.errorId)
    })

    it("fetches the case if the user is a trigger handler and the case has been resolved by them", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        triggerStatus: ResolutionStatus.Resolved,
        triggers: [
          {
            triggerCode: TriggerCode.TRPR0001,
            status: ResolutionStatus.Resolved,
            resolvedBy: "TriggerHandler",
            createdAt: new Date()
          } as unknown as Trigger
        ]
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        username: "TriggerHandler",
        groups: [UserGroup.TriggerHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect((result as CourtCase).errorId).toBe(inputCourtCase.errorId)
    })

    it("returns error if the user is a trigger handler but the case has been resolved by another user", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " "),
        triggerStatus: ResolutionStatus.Resolved,
        triggers: [
          {
            triggerCode: TriggerCode.TRPR0001,
            status: ResolutionStatus.Resolved,
            resolvedBy: "AnotherUser",
            createdAt: new Date()
          } as unknown as Trigger
        ]
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        username: "TriggerHandler",
        groups: [UserGroup.TriggerHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect(result).toBeNull()
    })

    it("returns an error if the user is an trigger handler but the case has no triggers", async () => {
      const inputCourtCase = await getDummyCourtCase({
        orgForPoliceFilter: courtCode.padEnd(6, " ")
      })
      await insertCourtCases(inputCourtCase)

      const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
        visibleForces: [courtCode.substring(0, 2)],
        visibleCourts: [],
        groups: [UserGroup.TriggerHandler]
      } as Partial<User> as User)

      expect(isError(result)).toBe(false)
      expect(result).toBeNull()
    })
  })

  it("Should call leftJoinAndSelectTriggersQuery with the correct arguments", async () => {
    const dummyErrorId = 0
    const dummyExcludedTriggers = ["TRPDUMMY"]
    await getCourtCaseByOrganisationUnit(dataSource, dummyErrorId, {
      visibleForces: [forceCode],
      visibleCourts: [],
      excludedTriggers: dummyExcludedTriggers
    } as Partial<User> as User)

    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledTimes(1)
    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledWith(expect.any(Object), dummyExcludedTriggers)
  })

  it("Should return court case details when record exists and is visible to the specified force", async () => {
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: courtCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [forceCode],
      visibleCourts: [],
      groups: [UserGroup.Supervisor]
    } as Partial<User> as User)

    expect(isError(result)).toBe(false)
    expect(result as CourtCase).toStrictEqual(inputCourtCase)
  })

  it("Should return court case details when record exists and is visible to the specified court", async () => {
    const inputCourtCase = await getDummyCourtCase({
      courtCode: courtCode
    })
    await insertCourtCases(inputCourtCase)

    const result = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, {
      visibleForces: [],
      visibleCourts: [courtCode.substring(0, 2)],
      groups: [UserGroup.Supervisor]
    } as Partial<User> as User)

    expect(isError(result)).toBe(false)
    expect(result as CourtCase).toStrictEqual(inputCourtCase)
  })

  it("Should return null if the court case doesn't exist", async () => {
    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [forceCode],
      visibleCourts: [],
      groups: [UserGroup.Supervisor]
    } as Partial<User> as User)

    expect(result).toBeNull()
  })

  it("Should return null when record exists and is not visible to the specified forces", async () => {
    const differentOrgCode = "36FPA3"
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: courtCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [differentOrgCode],
      visibleCourts: [],
      groups: [UserGroup.Supervisor]
    } as Partial<User> as User)

    expect(result).toBeNull()
  })

  it("Should return null when record exists and there is no visible forces", async () => {
    const inputCourtCase = await getDummyCourtCase({
      orgForPoliceFilter: courtCode.padEnd(6, " ")
    })
    await insertCourtCases(inputCourtCase)

    const result = await getCourtCaseByOrganisationUnit(dataSource, 0, {
      visibleForces: [],
      visibleCourts: [],
      groups: [UserGroup.Supervisor]
    } as Partial<User> as User)

    expect(result).toBeNull()
  })
})
