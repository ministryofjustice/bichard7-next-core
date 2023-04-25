/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import type { DataSource } from "typeorm"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import listCourtCases from "../../src/services/listCourtCases"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import deleteFromEntity from "../utils/deleteFromEntity"
import {
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers,
  insertCourtCasesWithFields
} from "../utils/insertCourtCases"
import insertException from "../utils/manageExceptions"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import { insertTriggers, TestTrigger } from "../utils/manageTriggers"
import Note from "services/entities/Note"
import { ResolutionStatus } from "types/ResolutionStatus"

jest.mock(
  "../../src/services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should call cases by visible forces query", async () => {
    const forceCode = "dummyForceCode"

    await listCourtCases(dataSource, { forces: [forceCode], maxPageItems: "1" })

    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledWith(expect.any(Object), [forceCode])
  })

  it("should return cases with notes correctly", async () => {
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
          user: "bichard01",
          text: "Test note 1"
        },
        {
          user: "System",
          text: "System note 3"
        }
      ],
      [
        {
          user: "bichard01",
          text: "Test note 2"
        },
        {
          user: "bichard02",
          text: "Test note 3"
        },
        {
          user: "bichard01",
          text: "Test note 2"
        }
      ]
    ]

    const query = await insertDummyCourtCasesWithNotes(caseNotes, "01")
    expect(isError(query)).toBe(false)

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases[0].notes).toHaveLength(1)
    expect(cases[1].notes).toHaveLength(3)
    expect(cases[2].notes).toHaveLength(3)
  })

  it("should return all the cases if they number less than or equal to the specified maxPageItems", async () => {
    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(100)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
    expect(totalCases).toBe(100)
  })

  it("shouldn't return more cases than the specified maxPageItems", async () => {
    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
    expect(totalCases).toBe(100)
  })

  it("shouldn't return more cases than the specified maxPageItems when cases have notes", async () => {
    const caseNote: { user: string; text: string }[] = [
      {
        user: "bichard01",
        text: "Test note 2"
      },
      {
        user: "bichard02",
        text: "Test note 3"
      },
      {
        user: "bichard01",
        text: "Test note 2"
      }
    ]

    const caseNotes: { user: string; text: string }[][] = new Array(100).fill(caseNote)

    await insertDummyCourtCasesWithNotes(caseNotes, "01")

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)
    expect(cases[0].notes[0].noteText).toBe("Test note 2")
    expect(totalCases).toBe(100)
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

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)
    expect(cases[0].triggers[0].triggerCode).toBe("TRPR0001")
    expect(cases[0].triggers[0].status).toBe("Unresolved")
    expect(totalCases).toBe(100)
  })

  it("should return the next page of items", async () => {
    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "2" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(10)
    expect(cases[9].errorId).toBe(19)
    expect(cases[0].messageId).toBe("xxx10")
    expect(cases[9].messageId).toBe("xxx19")
    expect(totalCases).toBe(100)
  })

  it("should return the last page of items correctly", async () => {
    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(90)
    expect(cases[9].errorId).toBe(99)
    expect(cases[0].messageId).toBe("xxx90")
    expect(cases[9].messageId).toBe("xxx99")
    expect(totalCases).toBe(100)
  })

  it("shouldn't return any cases if the page number is greater than the total pages", async () => {
    await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "11" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(0)
    expect(totalCases).toBe(100)
  })

  it("should order by court name", async () => {
    const orgCode = "36FPA1"
    await insertCourtCasesWithFields(
      ["BBBB", "CCCC", "AAAA"].map((courtName) => ({ courtName: courtName, orgForPoliceFilter: orgCode }))
    )

    const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtName" })
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].courtName).toBe("AAAA")
    expect(casesAsc[1].courtName).toBe("BBBB")
    expect(casesAsc[2].courtName).toBe("CCCC")
    expect(totalCasesAsc).toBe(3)

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      maxPageItems: "100",
      orderBy: "courtName",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtName).toBe("CCCC")
    expect(casesDesc[1].courtName).toBe("BBBB")
    expect(casesDesc[2].courtName).toBe("AAAA")
    expect(totalCasesDesc).toBe(3)
  })

  it("should order by court date", async () => {
    const orgCode = "36FPA1"
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2013-10-16")

    await insertCourtCasesWithFields([
      { courtDate: secondDate, orgForPoliceFilter: orgCode },
      { courtDate: firstDate, orgForPoliceFilter: orgCode },
      { courtDate: thirdDate, orgForPoliceFilter: orgCode }
    ])

    const result = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtDate" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate))
    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate))
    expect(totalCases).toBe(3)

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      maxPageItems: "100",
      orderBy: "courtDate",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtDate).toStrictEqual(thirdDate)
    expect(casesDesc[1].courtDate).toStrictEqual(secondDate)
    expect(casesDesc[2].courtDate).toStrictEqual(firstDate)
    expect(totalCasesDesc).toBe(3)
  })

  describe("ordered by 'lockedBy' reason", () => {
    it("should order by error reason as primary order", async () => {
      const orgCode = "36FPA1"
      await insertCourtCasesWithFields(
        ["HO100100", "HO100101", "HO100102"].map((code) => ({ errorReason: code, orgForPoliceFilter: orgCode }))
      )

      const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "reason" })
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].errorReason).toBe("HO100100")
      expect(casesAsc[1].errorReason).toBe("HO100101")
      expect(casesAsc[2].errorReason).toBe("HO100102")
      expect(totalCasesAsc).toBe(3)

      const resultDesc = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        orderBy: "reason",
        order: "desc"
      })
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].errorReason).toBe("HO100102")
      expect(casesDesc[1].errorReason).toBe("HO100101")
      expect(casesDesc[2].errorReason).toBe("HO100100")
      expect(totalCasesDesc).toBe(3)
    })

    it("should order by trigger reason as secondary order", async () => {
      const orgCode = "36FPA1"
      await insertCourtCasesWithFields(
        ["TRPR0010", "TRPR0011", "TRPR0012"].map((code) => ({ triggerReason: code, orgForPoliceFilter: orgCode }))
      )

      const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "reason" })
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].triggerReason).toBe("TRPR0010")
      expect(casesAsc[1].triggerReason).toBe("TRPR0011")
      expect(casesAsc[2].triggerReason).toBe("TRPR0012")
      expect(totalCasesAsc).toBe(3)

      const resultDesc = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        orderBy: "reason",
        order: "desc"
      })
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].triggerReason).toBe("TRPR0012")
      expect(casesDesc[1].triggerReason).toBe("TRPR0011")
      expect(casesDesc[2].triggerReason).toBe("TRPR0010")
      expect(totalCasesDesc).toBe(3)
    })
  })

  it("should order by notes number", async () => {
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
          user: "bichard01",
          text: "Test note 1"
        },
        {
          user: "System",
          text: "System note 3"
        }
      ],
      [
        {
          user: "bichard01",
          text: "Test note 2"
        },
        {
          user: "bichard02",
          text: "Test note 3"
        },
        {
          user: "bichard01",
          text: "Test note 2"
        }
      ]
    ]

    const orgCode = "36FPA1"
    await insertDummyCourtCasesWithNotes(caseNotes, "01")

    const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "notes" })
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].notes).toHaveLength(1)
    expect(casesAsc[1].notes).toHaveLength(3)
    expect(casesAsc[2].notes).toHaveLength(3)
    expect(totalCasesAsc).toBe(3)

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      maxPageItems: "100",
      orderBy: "notes",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].notes).toHaveLength(3)
    expect(casesDesc[1].notes).toHaveLength(3)
    expect(casesDesc[2].notes).toHaveLength(1)
    expect(totalCasesDesc).toBe(3)
  })
  describe("ordered by 'lockedBy' username", () => {
    it("should order by errorLockedByUsername as primary order and triggerLockedByUsername as secondary order", async () => {
      const orgCode = "36FPA1"

      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User4", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode }
      ])

      const resultAsc = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        orderBy: "lockedBy"
      })
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].errorLockedByUsername).toBe("User1")
      expect(casesAsc[0].triggerLockedByUsername).toBe("User3")
      expect(casesAsc[1].errorLockedByUsername).toBe("User1")
      expect(casesAsc[1].triggerLockedByUsername).toBe("User4")
      expect(casesAsc[2].errorLockedByUsername).toBe("User2")
      expect(casesAsc[2].triggerLockedByUsername).toBe("User1")
      expect(totalCasesAsc).toBe(3)

      const resultDesc = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        orderBy: "lockedBy",
        order: "desc"
      })
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].errorLockedByUsername).toBe("User2")
      expect(casesDesc[0].triggerLockedByUsername).toBe("User1")
      expect(casesDesc[1].errorLockedByUsername).toBe("User1")
      expect(casesDesc[1].triggerLockedByUsername).toBe("User4")
      expect(casesDesc[2].errorLockedByUsername).toBe("User1")
      expect(casesDesc[2].triggerLockedByUsername).toBe("User3")
      expect(totalCasesDesc).toBe(3)
    })
  })

  describe("search by defendant name", () => {
    it("should list cases when there is a case insensitive match", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      await insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        defendantName: "WAYNE Bruce"
      })
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)

      result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        defendantName: "WAYNE B"
      })
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
      expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
    })
  })

  describe("filter by cases allocated to me", () => {
    it("should list cases that are locked to me", async () => {
      const orgCode = "36FPA1"

      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User3", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100"
      })
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toBe("User1")
      expect(casesBefore[0].triggerLockedByUsername).toBe("User1")
      expect(casesBefore[1].errorLockedByUsername).toBe("User2")
      expect(casesBefore[1].triggerLockedByUsername).toBe("User2")
      expect(casesBefore[2].errorLockedByUsername).toBe("User3")
      expect(casesBefore[2].triggerLockedByUsername).toBe("User3")
      expect(totalCasesBefore).toBe(3)

      const resultAfter = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        allocatedToUserName: "User1"
      })
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toBe("User1")
      expect(casesAfter[0].triggerLockedByUsername).toBe("User1")
      expect(totalCasesAfter).toBe(1)
    })

    it("should list cases that have triggers locked to me", async () => {
      const orgCode = "36FPA1"

      await insertCourtCasesWithFields([
        { triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100"
      })
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].triggerLockedByUsername).toBe("User1")
      expect(casesBefore[1].triggerLockedByUsername).toBe("User2")
      expect(casesBefore[2].triggerLockedByUsername).toBe("User3")
      expect(totalCasesBefore).toBe(3)

      const resultAfter = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        allocatedToUserName: "User1"
      })
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].triggerLockedByUsername).toBe("User1")
      expect(totalCasesAfter).toBe(1)
    })

    it("should list cases that have errors locked to me", async () => {
      const orgCode = "36FPA1"

      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100"
      })
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toBe("User1")
      expect(casesBefore[1].errorLockedByUsername).toBe("User2")
      expect(casesBefore[2].errorLockedByUsername).toBe("User3")
      expect(totalCasesBefore).toBe(3)

      const resultAfter = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        allocatedToUserName: "User1"
      })
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toBe("User1")
      expect(totalCasesAfter).toBe(1)
    })
  })

  describe("search by court name", () => {
    it("should list cases when there is a case insensitive match", async () => {
      const orgCode = "01FPA1"
      const courtNameToInclude = "Magistrates' Courts London Croydon"
      const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
      const courtNameToNotInclude = "Court Name not to include"

      await insertCourtCasesWithFields([
        { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
        { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtName: "Magistrates' Courts London Croydon"
      })
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)

      result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtName: "magistrates' courts london"
      })
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)
      expect(cases[1].courtName).toStrictEqual(courtNameToIncludeWithPartialMatch)
    })
  })

  describe("search by ptiurn", () => {
    it("should list cases when there is a case insensitive match", async () => {
      const orgCode = "01FPA1"
      const ptiurnToInclude = "01ZD0303908"
      const ptiurnToIncludeWithPartialMatch = "01ZD0303909"
      const ptiurnToNotInclude = "00000000000"

      await insertCourtCasesWithFields([
        { ptiurn: ptiurnToInclude, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        ptiurn: "01ZD0303908"
      })
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)

      result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        ptiurn: "01ZD030390"
      })
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
      expect(cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch)
    })
  })

  describe("search by reason", () => {
    it("should list cases when there is a case insensitive match in triggers or exceptions", async () => {
      await insertCourtCasesWithFields(["01", "01", "01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode })))

      const triggerToInclude: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0111",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerToIncludePartialMatch: TestTrigger = {
        triggerId: 1,
        triggerCode: "TRPR2222",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerNotToInclude: TestTrigger = {
        triggerId: 2,
        triggerCode: "TRPR9999",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const errorToInclude = "HO00001"
      const errorToIncludePartialMatch = "HO002222"
      const errorNotToInclude = "HO999999"

      await insertTriggers(0, [triggerToInclude, triggerToIncludePartialMatch])
      await insertException(1, errorToInclude, `${errorToInclude}||ds:XMLField`)
      await insertException(2, errorToIncludePartialMatch, `${errorToIncludePartialMatch}||ds:XMLField`)
      await insertException(3, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)
      await insertTriggers(3, [triggerNotToInclude])

      // Searching for a full matched trigger code
      let result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasonCode: triggerToInclude.triggerCode
      })

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToInclude.triggerCode)

      // Searching for a full matched error code
      result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasonCode: errorToInclude
      })

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReason).toStrictEqual(errorToInclude)

      // Searching for a partial match error/trigger code
      result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasonCode: "2222"
      })

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToIncludePartialMatch.triggerCode)
      expect(cases[1].errorReason).toStrictEqual(errorToIncludePartialMatch)
    })

    it("should list cases when there is a case insensitive match in any exceptions", async () => {
      await insertCourtCasesWithFields(["01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode })))

      const errorToInclude = "HO100322"
      const anotherErrorToInclude = "HO100323"
      const errorNotToInclude = "HO200212"

      await insertException(0, errorToInclude, `${errorToInclude}||ds:OrganisationUnitCode`)
      await insertException(0, anotherErrorToInclude, `${anotherErrorToInclude}||ds:NextHearingDate`)
      await insertException(1, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)

      let result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasonCode: errorToInclude
      })

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toBe(
        `${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )

      result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasonCode: anotherErrorToInclude
      })

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toBe(
        `${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )
    })
  })

  describe("Filter cases having reason", () => {
    const testTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0001",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }

    const conditionalBailTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0010",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const bailDirectionTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0019",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const preChargeBailApplicationTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0019",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }

    it("Should filter by whether a case has triggers", async () => {
      await insertCourtCasesWithFields(["01", "01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode })))
      await insertTriggers(0, [testTrigger])
      await insertTriggers(1, [bailDirectionTrigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Triggers"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases[0].errorId).toBe(0)
      expect(cases[1].errorId).toBe(1)
    })

    it("Should filter by whether a case has excecptions", async () => {
      await insertCourtCasesWithFields(["01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode })))
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Exceptions"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorId).toBe(0)
    })

    it("Should filter cases that has bails", async () => {
      await insertCourtCasesWithFields(
        ["01", "01", "01", "01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode }))
      )
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])
      await insertTriggers(2, [conditionalBailTrigger])
      await insertTriggers(3, [bailDirectionTrigger])
      await insertTriggers(4, [preChargeBailApplicationTrigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Bails"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorId).toBe(2)
      expect(cases[1].errorId).toBe(3)
      expect(cases[2].errorId).toBe(4)
    })

    it("Should filter cases with all reasons", async () => {
      await insertCourtCasesWithFields(["01", "01", "01", "01"].map((orgCode) => ({ orgForPoliceFilter: orgCode })))
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])
      await insertTriggers(2, [conditionalBailTrigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Exceptions", "Triggers", "Bails"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorId).toBe(0)
      expect(cases[1].errorId).toBe(1)
      expect(cases[2].errorId).toBe(2)
    })
  })

  describe("Filter cases by urgency", () => {
    it("Should filter only urgent cases", async () => {
      const forceCode = "01"
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: true, orgForPoliceFilter: forceCode },
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: true, orgForPoliceFilter: forceCode }
      ])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        urgent: "Urgent"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 3])
    })

    it("Should filter non-urgent cases", async () => {
      const forceCode = "01"
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: true, orgForPoliceFilter: forceCode },
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: false, orgForPoliceFilter: forceCode }
      ])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        urgent: "Non-urgent"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
    })

    it("Should not filter cases when the urgent filter is undefined", async () => {
      const forceCode = "01"
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: true, orgForPoliceFilter: forceCode },
        { isUrgent: false, orgForPoliceFilter: forceCode },
        { isUrgent: true, orgForPoliceFilter: forceCode }
      ])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(4)
    })
  })

  describe("Filter cases by court date", () => {
    it("Should filter cases that within a start and end date", async () => {
      const orgCode = "36FPA1"
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

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtDateRange: { from: new Date("2008-01-01"), to: new Date("2008-12-31") }
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2])
    })

    it("Should filter cases by multiple date ranges", async () => {
      const orgCode = "36FPA1"
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

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtDateRange: [
          { from: new Date("2008-01-26"), to: new Date("2008-01-26") },
          { from: new Date("2008-03-26"), to: new Date("2008-03-26") },
          { from: new Date("2013-10-16"), to: new Date("2013-10-16") }
        ]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3])
    })
  })

  describe("Filter cases by locked status", () => {
    it("Should filter cases that are locked", async () => {
      const orgCode = "36FP"
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: orgCode },
        { orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: true
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0])
    })

    it("Should filter cases that are unlocked", async () => {
      const orgCode = "36FP"
      const lockedCase = {
        errorId: 0,
        errorLockedByUsername: "bichard01",
        triggerLockedByUsername: "bichard01",
        messageId: "0"
      }
      const unlockedCase = {
        errorId: 1,
        messageId: "1"
      }

      await insertCourtCasesWithFields([lockedCase, unlockedCase])

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: false
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1])
    })

    it("Should treat cases with only one lock as locked.", async () => {
      const orgCode = "36FP"
      await insertCourtCasesWithFields([
        {
          errorId: 0,
          errorLockedByUsername: "bichard01",
          messageId: "0"
        },
        {
          errorId: 1,
          triggerLockedByUsername: "bichard01",
          messageId: "1"
        },
        {
          errorId: 2,
          messageId: "2"
        }
      ])

      const lockedResult = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: true
      })

      expect(isError(lockedResult)).toBeFalsy()
      const { result: lockedCases } = lockedResult as ListCourtCaseResult

      expect(lockedCases).toHaveLength(2)
      expect(lockedCases.map((c) => c.errorId)).toStrictEqual([0, 1])

      const unlockedResult = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: false
      })

      expect(isError(unlockedResult)).toBeFalsy()
      const { result: unlockedCases } = unlockedResult as ListCourtCaseResult

      expect(unlockedCases).toHaveLength(1)
      expect(unlockedCases.map((c) => c.errorId)).toStrictEqual([2])
    })
  })

  describe("Filter cases by case state", () => {
    it("Should return unresolved cases if case state not set", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      await insertCourtCasesWithFields(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map((timeStamp) => ({
          resolutionTimestamp: timeStamp,
          orgForPoliceFilter: orgCode
        }))
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([null])
    })

    it("Should filter cases that are resolved", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      await insertCourtCasesWithFields(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map((timeStamp) => ({
          resolutionTimestamp: timeStamp,
          orgForPoliceFilter: orgCode
        }))
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        caseState: "Resolved"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([
        resolutionTimestamp,
        resolutionTimestamp,
        resolutionTimestamp
      ])
    })

    it("Should return all cases if case state is 'Unresolved and resolved'", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      await insertCourtCasesWithFields(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map((timeStamp) => ({
          resolutionTimestamp: timeStamp,
          orgForPoliceFilter: orgCode
        }))
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        caseState: "Unresolved and resolved"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(4)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([
        null,
        resolutionTimestamp,
        resolutionTimestamp,
        resolutionTimestamp
      ])
    })
  })

  describe("Filter cases by resolution status", () => {
    it("should show supervisors all resolved cases for their force", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      const casesToInsert: Partial<CourtCase>[] = [undefined, "Bichard01", "Supervisor", "Bichard02", undefined].map(
        (resolver) => ({
          resolutionTimestamp: resolver !== undefined ? resolutionTimestamp : null,
          errorResolvedTimestamp: resolver !== undefined ? resolutionTimestamp : null,
          errorResolvedBy: resolver ?? null,
          orgForPoliceFilter: orgCode
        })
      )

      await insertCourtCasesWithFields(casesToInsert)

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        caseState: "Resolved"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3])
    })

    it("should show handlers cases that they resolved", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      const thisUser = "Bichard01"
      const otherUser = "Bichard02"
      const casesToInsert: Partial<CourtCase>[] = [thisUser, otherUser, thisUser, otherUser].map((user) => ({
        resolutionTimestamp: resolutionTimestamp,
        orgForPoliceFilter: orgCode,
        errorResolvedBy: user
      }))

      await insertCourtCasesWithFields(casesToInsert)

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        caseState: "Resolved",
        resolvedByUsername: thisUser
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0, 2])
    })

    it("should show handlers cases that they resolved a trigger for", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      const thisUser = "Bichard01"
      const otherUser = "Bichard02"
      const casesToInsert: Partial<CourtCase>[] = [
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser
        },
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser
        },
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser,
          triggerResolvedBy: thisUser
        }
      ]

      await insertCourtCasesWithFields(casesToInsert)

      await insertTriggers(0, [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Resolved",
          createdAt: resolutionTimestamp,
          resolvedAt: resolutionTimestamp,
          resolvedBy: thisUser
        }
      ])

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        caseState: "Resolved",
        resolvedByUsername: thisUser
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0, 2])
    })
  })
})
