import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import FakeDataStoreGateway from "../services/gateways/dataStoreGateways/fakeDataStoreGateway"
import canUseResubmitCaseExecute from "./canUserResubmitCase"

describe("canUseResubmitCase", () => {
  const dataSourceGateway = new FakeDataStoreGateway()

  describe("execute", () => {
    it("returns false if the groups attribute is not defined", async () => {
      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: undefined } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns false if the user isn't any allowed groups", async () => {
      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: [UserGroup.AuditLoggingManager] } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns true if the user is in any allowed groups", async () => {
      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: [UserGroup.ExceptionHandler] } as User,
        caseId: 123
      })

      expect(result).toBe(true)
    })

    it("returns false if the username isn't error_locked_by_id and user force is not the same as case force", async () => {
      jest.spyOn(dataSourceGateway, "canCaseBeResubmitted").mockResolvedValue(false)

      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: [UserGroup.ExceptionHandler], visible_forces: "01" } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns false if the username is error_locked_by_id, user force is the same as case force and the case is resolved", async () => {
      jest.spyOn(dataSourceGateway, "canCaseBeResubmitted").mockResolvedValue(false)

      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: [UserGroup.ExceptionHandler], visible_forces: "01" } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns true if the username is error_locked_by_id, user force is the same as case force and the case is unresolved", async () => {
      jest.spyOn(dataSourceGateway, "canCaseBeResubmitted").mockResolvedValue(true)

      const result = await canUseResubmitCaseExecute({
        dataSourceGateway,
        user: { groups: [UserGroup.ExceptionHandler], visible_forces: "01" } as User,
        caseId: 123
      })

      expect(result).toBe(true)
    })
  })
})
