import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import CourtCase from "services/entities/CourtCase"
import Trigger from "services/entities/Trigger"
import getDataSource from "services/getDataSource"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { ResolutionStatus } from "types/ResolutionStatus"
import { isError } from "types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields, insertDummyCourtCasesWithTriggers } from "../utils/insertCourtCases"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"

describe("leftJoinAndSelectTriggersQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>
  const dummyOrgCode = "01"
  const testTrigger: { code: string; status: ResolutionStatus } = {
    code: "TRPR0001",
    status: "Unresolved"
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("When there aren't any excluded triggers", () => {
    it("Should return a list of cases with triggers are empty", async () => {
      await insertDummyCourtCasesWithTriggers(
        [[testTrigger, testTrigger, testTrigger], [testTrigger, testTrigger], [testTrigger]],
        dummyOrgCode
      )

      const result = await leftJoinAndSelectTriggersQuery(query, [])
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(3)
      expect(cases[0].triggers).toHaveLength(3)
      expect(cases[1].triggers).toHaveLength(2)
      expect(cases[2].triggers).toHaveLength(1)
    })

    it("Should return a list of cases with triggers are undefined", async () => {
      await insertDummyCourtCasesWithTriggers([[testTrigger, testTrigger]], dummyOrgCode)

      const result = await leftJoinAndSelectTriggersQuery(query, undefined)
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(1)
      expect(cases[0].triggers).toHaveLength(2)
    })
  })

  describe("When there are excluded triggers", () => {
    it("Should return cases with triggers that are not excluded", async () => {
      const excludedTriggerCodes = ["TRPR0001", "TRPR0003"]
      const caseOneTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: excludedTriggerCodes[0],
          status: "Unresolved"
        },
        {
          code: excludedTriggerCodes[1],
          status: "Unresolved"
        }
      ]

      const caseTwoTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: excludedTriggerCodes[0],
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Unresolved"
        },
        {
          code: excludedTriggerCodes[1],
          status: "Unresolved"
        }
      ]
      await insertDummyCourtCasesWithTriggers([caseOneTriggers, caseTwoTriggers], dummyOrgCode)

      const result = await leftJoinAndSelectTriggersQuery(query, excludedTriggerCodes)
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)

      expect(result).toHaveLength(2)
      const cases = result as CourtCase[]
      expect(cases[0].triggers).toHaveLength(0)
      expect(cases[1].triggers).toHaveLength(1)
      expect(cases[1].triggers[0].triggerCode).toEqual("TRPR0002")
    })
  })

  describe("Select triggers by case state", () => {
    it("Should not include resolved triggers when caseState is set to 'Unresolved'", async () => {
      const caseOneTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Unresolved"
        }
      ]

      const caseTwoTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Resolved"
        },
        {
          code: "TRPR0002",
          status: "Resolved"
        }
      ]
      await insertDummyCourtCasesWithTriggers([caseOneTriggers, caseTwoTriggers], dummyOrgCode)

      const result = await leftJoinAndSelectTriggersQuery(query, [], "Unresolved")
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers).toHaveLength(1)
      expect(cases[1].triggers).toHaveLength(0)
    })

    it("Should only include resolved triggers when case state is 'Resolved'", async () => {
      const resolvedTriggerCode = TriggerCode.TRPR0002

      const firstResolvedTrigger: TestTrigger = {
        triggerId: 0,
        status: "Resolved",
        triggerCode: resolvedTriggerCode,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const secondResolvedTrigger: TestTrigger = {
        triggerId: 1,
        status: "Resolved",
        triggerCode: resolvedTriggerCode,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const firstUnresolvedTrigger: TestTrigger = {
        triggerId: 2,
        status: "Unresolved",
        triggerCode: TriggerCode.TRPR0008,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const secondUnresolvedTrigger: TestTrigger = {
        triggerId: 3,
        status: "Unresolved",
        triggerCode: TriggerCode.TRPR0008,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      await insertCourtCasesWithFields(Array.from({ length: 2 }, () => ({ orgForPoliceFilter: dummyOrgCode })))
      await insertTriggers(0, [firstResolvedTrigger, firstUnresolvedTrigger])
      await insertTriggers(1, [secondResolvedTrigger, secondUnresolvedTrigger])

      const result = await leftJoinAndSelectTriggersQuery(query, [], "Resolved")
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      cases.forEach((caseWithTrigger) => {
        expect(caseWithTrigger.triggers).toHaveLength(1)
        expect(caseWithTrigger.triggers[0].triggerCode).toEqual(resolvedTriggerCode)
        expect(caseWithTrigger.triggers[0].status).toEqual("Resolved")
      })
    })

    it("Should include both resolved and unresolved triggers when case state is undefined", async () => {
      const triggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Unresolved"
        },
        {
          code: "TRPR0002",
          status: "Resolved"
        }
      ]
      await insertDummyCourtCasesWithTriggers([triggers, triggers], dummyOrgCode)

      const result = await leftJoinAndSelectTriggersQuery(query, [])
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)

      expect(isError(result)).toBe(false)
      const cases = result as CourtCase[]

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers).toHaveLength(2)
      expect(cases[1].triggers).toHaveLength(2)
    })
  })
})
