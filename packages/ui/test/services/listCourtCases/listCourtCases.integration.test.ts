/* eslint-disable @typescript-eslint/naming-convention */
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import "reflect-metadata"
import Note from "services/entities/Note"
import User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { LockedState } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import listCourtCases from "../../../src/services/listCourtCases"
import { isError } from "../../../src/types/Result"
import { hasAccessToAll } from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import {
  insertCourtCasesWithFields,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers
} from "../../utils/insertCourtCases"
import insertException from "../../utils/manageExceptions"
import { TestTrigger, insertTriggers } from "../../utils/manageTriggers"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
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

  it("Should call cases by organisation unit query", async () => {
    await listCourtCases(dataSource, { maxPageItems: 1 }, testUser)

    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), testUser)
  })

  it("Should call leftJoinAndSelectTriggersQuery with the correct arguments", async () => {
    const excludedTriggers = ["TRPDUMMY"]
    const caseState = "Resolved"
    const excludedTriggersUser = Object.assign({ excludedTriggers: excludedTriggers }, testUser)

    await listCourtCases(dataSource, { maxPageItems: 1, caseState: caseState }, excludedTriggersUser)

    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledTimes(1)
    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledWith(expect.any(Object), excludedTriggers, caseState)
  })

  it("Should return cases with notes correctly", async () => {
    const caseNotes: { user: string; text: string }[][] = [
      [
        {
          user: "System",
          text: "System note 1"
        }
      ],
      [
        {
          user: "System",
          text: "System note 2"
        },
        {
          user: "BichardForce01",
          text: "Test note 1"
        },
        {
          user: "System",
          text: "System note 3"
        }
      ],
      [
        {
          user: "BichardForce01",
          text: "Test note 2"
        },
        {
          user: "BichardForce02",
          text: "Test note 3"
        },
        {
          user: "BichardForce01",
          text: "Test note 2"
        }
      ]
    ]

    const query = await insertDummyCourtCasesWithNotes(caseNotes, orgCode)
    expect(isError(query)).toBe(false)

    const result = await listCourtCases(dataSource, { maxPageItems: 100 }, testUser)
    expect(isError(result)).toBe(false)
    const { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases[0].notes).toHaveLength(1)
    expect(cases[1].notes).toHaveLength(3)
    expect(cases[2].notes).toHaveLength(3)
  })

  describe("Pagination", () => {
    it("Should return all the cases if they number less than or equal to the specified maxPageItems", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: 100 }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(100)

      expect(cases[0].errorId).toBe(0)
      expect(cases[9].errorId).toBe(9)
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return more cases than the specified maxPageItems", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: 10 }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(0)
      expect(cases[9].errorId).toBe(9)
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return more cases than the specified maxPageItems when cases have notes", async () => {
      const caseNote: { user: string; text: string }[] = [
        {
          user: "BichardForce01",
          text: "Test note 2"
        },
        {
          user: "BichardForce02",
          text: "Test note 3"
        },
        {
          user: "BichardForce01",
          text: "Test note 2"
        }
      ]

      const caseNotes: { user: string; text: string }[][] = new Array(100).fill(caseNote)

      await insertDummyCourtCasesWithNotes(caseNotes, "01")

      const result = await listCourtCases(dataSource, { maxPageItems: 10 }, {
        visibleForces: ["01"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)
      expect(cases[0].notes[0].noteText).toBe("Test note 2")
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return more cases than the specified maxPageItems when cases have triggers", async () => {
      const caseTrigger: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Resolved"
        },
        {
          code: "TRPR0003",
          status: "Submitted"
        }
      ]
      const caseTriggers: { code: string; status: ResolutionStatus }[][] = new Array(100).fill(caseTrigger)

      await insertDummyCourtCasesWithTriggers(caseTriggers, "01")

      const result = await listCourtCases(dataSource, { maxPageItems: 10 }, {
        visibleForces: ["01"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)
      expect(cases[0].triggers[0].triggerCode).toBe("TRPR0001")
      expect(cases[0].triggers[0].status).toBe("Unresolved")
      expect(totalCases).toEqual(100)
    })

    it("Should return the next page of items", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: 10, page: 2 }, {
        visibleForces: ["036"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(10)
      expect(cases[9].errorId).toBe(19)
      expect(totalCases).toEqual(100)
    })

    it("Should return the last page of items correctly", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: orgCode })))

      const result = await listCourtCases(dataSource, { maxPageItems: 10, page: 10 }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(90)
      expect(cases[9].errorId).toBe(99)
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return any cases if the page number is greater than the total pages", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: orgCode })))

      const result = await listCourtCases(dataSource, { maxPageItems: 10, page: 11 }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(0)
      expect(totalCases).toEqual(100)
    })
  })

  it("Should order by court name", async () => {
    await insertCourtCasesWithFields(
      ["BBBB", "CCCC", "AAAA"].map((courtName) => ({ courtName: courtName, orgForPoliceFilter: orgCode }))
    )

    const resultAsc = await listCourtCases(dataSource, { maxPageItems: 100, orderBy: "courtName" }, testUser)
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].courtName).toStrictEqual("AAAA")
    expect(casesAsc[1].courtName).toStrictEqual("BBBB")
    expect(casesAsc[2].courtName).toStrictEqual("CCCC")
    expect(totalCasesAsc).toEqual(3)

    const resultDesc = await listCourtCases(
      dataSource,
      { maxPageItems: 100, orderBy: "courtName", order: "desc" },
      testUser
    )
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtName).toStrictEqual("CCCC")
    expect(casesDesc[1].courtName).toStrictEqual("BBBB")
    expect(casesDesc[2].courtName).toStrictEqual("AAAA")
    expect(totalCasesDesc).toEqual(3)
  })

  it("Should order by court date", async () => {
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2013-10-16")

    await insertCourtCasesWithFields([
      { courtDate: secondDate, orgForPoliceFilter: orgCode },
      { courtDate: firstDate, orgForPoliceFilter: orgCode },
      { courtDate: thirdDate, orgForPoliceFilter: orgCode }
    ])

    const result = await listCourtCases(dataSource, { maxPageItems: 100, orderBy: "courtDate" }, testUser)
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate))
    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate))
    expect(totalCases).toEqual(3)

    const resultDesc = await listCourtCases(
      dataSource,
      { maxPageItems: 100, orderBy: "courtDate", order: "desc" },
      testUser
    )
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtDate).toStrictEqual(thirdDate)
    expect(casesDesc[1].courtDate).toStrictEqual(secondDate)
    expect(casesDesc[2].courtDate).toStrictEqual(firstDate)
    expect(totalCasesDesc).toEqual(3)
  })

  describe("filter by cases allocated to me", () => {
    it("Should list cases that are locked to me", async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: "BichardForce01",
          triggerLockedByUsername: "BichardForce01",
          orgForPoliceFilter: orgCode
        },
        {
          errorLockedByUsername: "BichardForce02",
          triggerLockedByUsername: "BichardForce02",
          orgForPoliceFilter: orgCode
        },
        {
          errorLockedByUsername: "BichardForce03",
          triggerLockedByUsername: "BichardForce03",
          orgForPoliceFilter: orgCode
        }
      ])

      const resultBefore = await listCourtCases(dataSource, { maxPageItems: 100 }, testUser)
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toStrictEqual("BichardForce01")
      expect(casesBefore[0].triggerLockedByUsername).toStrictEqual("BichardForce01")
      expect(casesBefore[1].errorLockedByUsername).toStrictEqual("BichardForce02")
      expect(casesBefore[1].triggerLockedByUsername).toStrictEqual("BichardForce02")
      expect(casesBefore[2].errorLockedByUsername).toStrictEqual("BichardForce03")
      expect(casesBefore[2].triggerLockedByUsername).toStrictEqual("BichardForce03")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        { maxPageItems: 100, allocatedToUserName: "BichardForce01" },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toStrictEqual("BichardForce01")
      expect(casesAfter[0].triggerLockedByUsername).toStrictEqual("BichardForce01")
      expect(totalCasesAfter).toEqual(1)
    })

    it("Should list cases that have triggers locked to me", async () => {
      await insertCourtCasesWithFields([
        { triggerLockedByUsername: "BichardForce01", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "BichardForce02", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "BichardForce03", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(dataSource, { maxPageItems: 100 }, testUser)
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].triggerLockedByUsername).toStrictEqual("BichardForce01")
      expect(casesBefore[1].triggerLockedByUsername).toStrictEqual("BichardForce02")
      expect(casesBefore[2].triggerLockedByUsername).toStrictEqual("BichardForce03")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        { maxPageItems: 100, allocatedToUserName: "BichardForce01" },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].triggerLockedByUsername).toStrictEqual("BichardForce01")
      expect(totalCasesAfter).toEqual(1)
    })

    it("Should list cases that have errors locked to me", async () => {
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "BichardForce01", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "BichardForce02", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "BichardForce03", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(dataSource, { maxPageItems: 100 }, testUser)
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toStrictEqual("BichardForce01")
      expect(casesBefore[1].errorLockedByUsername).toStrictEqual("BichardForce02")
      expect(casesBefore[2].errorLockedByUsername).toStrictEqual("BichardForce03")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        { maxPageItems: 100, allocatedToUserName: "BichardForce01" },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toStrictEqual("BichardForce01")
      expect(totalCasesAfter).toEqual(1)
    })
  })

  describe("search by court name", () => {
    it("Should list cases when there is a case insensitive match", async () => {
      const courtNameToInclude = "Magistrates' Courts London Croydon"
      const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
      const courtNameToNotInclude = "Court Name not to include"

      await insertCourtCasesWithFields([
        { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
        { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, courtName: "Magistrates' Courts London Croydon" },
        testUser
      )
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)

      result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, courtName: "magistrates' courts london" },
        testUser
      )
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)
      expect(cases[1].courtName).toStrictEqual(courtNameToIncludeWithPartialMatch)
    })
  })

  describe("search by ptiurn", () => {
    it("Should list cases when there is a case insensitive match", async () => {
      const ptiurnToInclude = "01ZD0303908"
      const ptiurnToIncludeWithPartialMatch = "01ZD0303909"
      const ptiurnToNotInclude = "00000000000"

      await insertCourtCasesWithFields([
        { ptiurn: ptiurnToInclude, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(dataSource, { maxPageItems: 100, ptiurn: "01ZD0303908" }, testUser)
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)

      result = await listCourtCases(dataSource, { maxPageItems: 100, ptiurn: "01ZD030390" }, testUser)
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
      expect(cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch)
    })
  })

  describe("search by reason", () => {
    it("Should list cases when there is a case insensitive match in triggers or exceptions", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 4 }, () => ({ orgForPoliceFilter: orgCode })))

      const triggerToInclude: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerToIncludePartialMatch: TestTrigger = {
        triggerId: 1,
        triggerCode: TriggerCode.TRPR0012,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerNotToInclude: TestTrigger = {
        triggerId: 2,
        triggerCode: TriggerCode.TRPR0008,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const errorToInclude = "HO00001"
      const errorNotToInclude = "HO999999"

      await insertTriggers(0, [triggerToInclude, triggerToIncludePartialMatch])
      await insertException(1, errorToInclude, `${errorToInclude}||ds:XMLField`)
      await insertException(3, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)
      await insertTriggers(3, [triggerNotToInclude])

      // Searching for a full matched trigger code
      let result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, reasonCodes: [triggerToInclude.triggerCode] },
        testUser
      )

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToInclude.triggerCode)

      // Searching for a full matched error code
      result = await listCourtCases(dataSource, { maxPageItems: 100, reasonCodes: [errorToInclude] }, testUser)

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReason).toStrictEqual(errorToInclude)
    })

    it("Should list cases when there is a case insensitive match in any exceptions", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 2 }, () => ({ orgForPoliceFilter: orgCode })))

      const errorToInclude = "HO100322"
      const anotherErrorToInclude = "HO100323"
      const errorNotToInclude = "HO200212"

      await insertException(0, errorToInclude, `${errorToInclude}||ds:OrganisationUnitCode`)
      await insertException(0, anotherErrorToInclude, `${anotherErrorToInclude}||ds:NextHearingDate`)
      await insertException(1, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)

      let result = await listCourtCases(dataSource, { maxPageItems: 100, reasonCodes: [errorToInclude] }, testUser)

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toStrictEqual(
        `HO100102||ds:NextHearingDate, ${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )

      result = await listCourtCases(dataSource, { maxPageItems: 100, reasonCodes: [anotherErrorToInclude] }, testUser)

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toStrictEqual(
        `HO100102||ds:NextHearingDate, ${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )
    })

    it("Should list cases when multiple triggers or exceptions are provided", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 4 }, () => ({ orgForPoliceFilter: orgCode })))

      const triggerToInclude: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerNotToInclude: TestTrigger = {
        triggerId: 2,
        triggerCode: TriggerCode.TRPR0008,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const errorToInclude = "HO00001"
      const errorNotToInclude = "HO999999"

      await insertTriggers(0, [triggerToInclude])
      await insertException(1, errorToInclude, `${errorToInclude}||ds:XMLField`)
      await insertException(3, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)
      await insertTriggers(3, [triggerNotToInclude])

      const result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, reasonCodes: [triggerToInclude.triggerCode, errorToInclude] },
        testUser
      )

      expect(isError(result)).toBe(false)
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToInclude.triggerCode)
      expect(cases[1].errorReason).toEqual(errorToInclude)
    })
  })

  describe("Filter cases by court date", () => {
    it("Should filter cases that within a start and end date ", async () => {
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithFields([
        { courtDate: firstDate, orgForPoliceFilter: orgCode },
        { courtDate: secondDate, orgForPoliceFilter: orgCode },
        { courtDate: thirdDate, orgForPoliceFilter: orgCode },
        { courtDate: fourthDate, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: 100,
          courtDateRange: { from: new Date("2008-01-01"), to: new Date("2008-12-31") }
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2])
    })

    it("Should filter cases by multiple date ranges", async () => {
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithFields([
        { courtDate: firstDate, orgForPoliceFilter: orgCode },
        { courtDate: secondDate, orgForPoliceFilter: orgCode },
        { courtDate: thirdDate, orgForPoliceFilter: orgCode },
        { courtDate: fourthDate, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: 100,
          courtDateRange: [
            { from: new Date("2008-01-26"), to: new Date("2008-01-26") },
            { from: new Date("2008-03-26"), to: new Date("2008-03-26") },
            { from: new Date("2013-10-16"), to: new Date("2013-10-16") }
          ]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3])
    })
  })

  describe("Filter cases by locked status", () => {
    it("Should filter cases that are locked ", async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: "BichardForce01",
          triggerLockedByUsername: "BichardForce01",
          orgForPoliceFilter: orgCode
        },
        { orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(dataSource, { maxPageItems: 100, lockedState: LockedState.Locked }, testUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0])
    })

    it("Should filter cases that are unlocked ", async () => {
      const lockedCase = {
        errorId: 0,
        errorLockedByUsername: "BichardForce01",
        triggerLockedByUsername: "BichardForce01"
      }
      const unlockedCase = {
        errorId: 1
      }

      await insertCourtCasesWithFields([lockedCase, unlockedCase])

      const result = await listCourtCases(
        dataSource,
        { maxPageItems: 100, lockedState: LockedState.Unlocked },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1])
    })

    it("Should treat cases with only one lock as locked.  ", async () => {
      await insertCourtCasesWithFields([
        {
          errorId: 0,
          errorLockedByUsername: "BichardForce01"
        },
        {
          errorId: 1,
          triggerLockedByUsername: "BichardForce01"
        },
        {
          errorId: 2
        }
      ])

      const lockedResult = await listCourtCases(
        dataSource,
        { maxPageItems: 100, lockedState: LockedState.Locked },
        testUser
      )

      expect(isError(lockedResult)).toBeFalsy()
      const { result: lockedCases } = lockedResult as ListCourtCaseResult

      expect(lockedCases).toHaveLength(2)
      expect(lockedCases.map((c) => c.errorId)).toStrictEqual([0, 1])

      const unlockedResult = await listCourtCases(
        dataSource,
        { maxPageItems: 100, lockedState: LockedState.Unlocked },
        testUser
      )

      expect(isError(unlockedResult)).toBeFalsy()
      const { result: unlockedCases } = unlockedResult as ListCourtCaseResult

      expect(unlockedCases).toHaveLength(1)
      expect(unlockedCases.map((c) => c.errorId)).toStrictEqual([2])
    })
  })
})
