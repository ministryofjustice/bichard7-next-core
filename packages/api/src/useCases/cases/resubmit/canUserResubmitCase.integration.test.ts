import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { ResolutionStatusNumber } from "../../dto/convertResolutionStatus"
import canUseResubmitCaseExecute from "./canUserResubmitCase"

const testDatabaseGateway = new End2EndPostgres()

describe("canUseResubmitCase", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  describe("execute", () => {
    it("returns false if the user is not assigned to any group", async () => {
      const user = await createUser(testDatabaseGateway, { groups: [] })
      const caseObj = await createCase(testDatabaseGateway)

      const result = await canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)

      expect(result).toBe(false)
    })

    it("returns false if the user isn't in any allowed groups", async () => {
      const user = await createUser(testDatabaseGateway, {
        groups: [
          UserGroup.Audit,
          UserGroup.AuditLoggingManager,
          UserGroup.NewUI,
          UserGroup.SuperUserManager,
          UserGroup.TriggerHandler,
          UserGroup.UserManager
        ]
      })
      const caseObj = await createCase(testDatabaseGateway)

      const result = await canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)

      expect(result).toBe(false)
    })

    it("returns true if the user is in any allowed groups", async () => {
      const usersCases = await Promise.all(
        [UserGroup.ExceptionHandler, UserGroup.GeneralHandler, UserGroup.Supervisor, UserGroup.Allocator].map(
          async (group, index) => {
            const user = await createUser(testDatabaseGateway, {
              email: `user${index}@example.com`,
              groups: [group],
              id: index,
              username: `user${index}`
            })

            const caseObj = await createCase(testDatabaseGateway, {
              errorId: index,
              errorLockedById: user.username
            })

            return { case: caseObj, user }
          }
        )
      )

      const result = await Promise.all(
        usersCases.map(({ case: caseObj, user }) =>
          canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)
        )
      )

      expect(result).toEqual(Array(usersCases.length).fill(true))
    })

    it("returns false if exceptions are not locked by the user", async () => {
      const user = await createUser(testDatabaseGateway, {
        groups: [UserGroup.GeneralHandler],
        visibleForces: ["02"]
      })
      const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, orgForPoliceFilter: "02" })

      const result = await canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)

      expect(result).toBe(false)
    })

    it("returns false if user force is not the same as the case force", async () => {
      const user = await createUser(testDatabaseGateway, {
        groups: [UserGroup.GeneralHandler],
        visibleCourts: [],
        visibleForces: ["02"]
      })
      const caseObj = await createCase(testDatabaseGateway, {
        errorLockedById: user.username,
        orgForPoliceFilter: "01"
      })

      const result = await canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)

      expect(result).toBe(false)
    })

    it("returns false if case is resolved", async () => {
      const user = await createUser(testDatabaseGateway, {
        groups: [UserGroup.GeneralHandler],
        visibleForces: ["02"]
      })
      const caseObj = await createCase(testDatabaseGateway, {
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "02"
      })

      const result = await canUseResubmitCaseExecute(testDatabaseGateway.readonly, user, caseObj.errorId)

      expect(result).toBe(false)
    })
  })
})
