import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { FastifyBaseLogger } from "fastify"

import { expect } from "@jest/globals"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"
import filter from "./fetchCase"

const testDatabaseGateway = new End2EndPostgres()
const testLogger = jest.fn() as unknown as FastifyBaseLogger

describe("fetchCase", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns an error if the case isn't found", async () => {
    const user = await createUser(testDatabaseGateway)

    const result = await filter(testDatabaseGateway.readonly, user, 0, testLogger)

    expect((result as Error).message).toBe("Case id 0 for user User1 not found")
  })

  it("returns an error if the case isn't in the correct force and court", async () => {
    const user = await createUser(testDatabaseGateway, { id: 1, visibleCourts: [], visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })

    const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

    expect((result as Error).message).toBe("Case id 1 for user User1 not found")
  })

  it("fetches the Case when both court and force match", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["AB"], visibleForces: ["02"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })

  it("fetches the Case when only court matches", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["AB"], visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })

  it("fetches the Case when only force matches", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["QW"], visibleForces: ["02"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })

  describe("Test different roles", () => {
    it("fetches case if user is a supervisor", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Supervisor], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, { errorStatus: 2 })

      const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

      expect(result.errorId).toEqual(caseObj.errorId)
    })

    it("returns error if user in no groups", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.NewUI], id: 1 })
      const caseObj = await createCase(testDatabaseGateway)

      const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Case id 1 for user User1 not found")
    })

    it("fetches the case if the user is an exception handler and the case has unresolved exceptions", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, {
        errorCount: 1
      })

      const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

      expect(result.errorId).toEqual(caseObj.errorId)
    })

    it("fetches the case if the user is an exception handler and the case has been resolved by them", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, {
        errorCount: 1,
        errorResolvedBy: user.username,
        errorStatus: ResolutionStatusNumber.Resolved
      })

      const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

      expect(result.errorId).toEqual(caseObj.errorId)
    })

    it("returns error if the user is an exception handler but the case has been resolved by another user", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, {
        errorCount: 1,
        errorResolvedBy: "another_user",
        errorStatus: ResolutionStatusNumber.Resolved
      })

      const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Case id 1 for user User1 not found")
    })

    it("returns an error if the user is an exception handler but the case has no exceptions", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, {
        errorCount: 0
      })

      const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Case id 1 for user User1 not found")
    })

    it("fetches the case if the user is a trigger handler and the case has unresolved triggers", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway)
      await createTriggers(testDatabaseGateway, caseObj.errorId, [{}])

      const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

      expect(result.errorId).toEqual(caseObj.errorId)
    })

    it("fetches the case if the user is a trigger handler and the case has been resolved by them", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, { triggerStatus: ResolutionStatusNumber.Resolved })
      await createTriggers(testDatabaseGateway, caseObj.errorId, [
        { resolvedBy: user.username, status: ResolutionStatusNumber.Resolved }
      ])

      const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

      expect(result.errorId).toEqual(caseObj.errorId)
    })

    it("returns error if the user is a trigger handler but the case has been resolved by another user", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway, { triggerStatus: ResolutionStatusNumber.Resolved })
      await createTriggers(testDatabaseGateway, caseObj.errorId, [
        { resolvedBy: "another_user", status: ResolutionStatusNumber.Resolved }
      ])

      const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Case id 1 for user User1 not found")
    })

    it("returns an error if the user is an trigger handler but the case has no triggers", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
      const caseObj = await createCase(testDatabaseGateway)

      const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Case id 1 for user User1 not found")
    })
  })
})
