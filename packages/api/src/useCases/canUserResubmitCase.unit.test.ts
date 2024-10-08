import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import FakeGateway from "services/gateways/fakeGateway"
import canUseResubmitCaseExecute from "useCases/canUserResubmitCase"

describe("canUseResubmitCase", () => {
  const gateway = new FakeGateway()

  describe("execute", () => {
    it("returns allowed false if the user isn't any allowed groups", async () => {
      const result = await canUseResubmitCaseExecute({
        gateway,
        user: { groups: [UserGroup.AuditLoggingManager] } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns allowed true if the user is in any allowed groups", async () => {
      const result = await canUseResubmitCaseExecute({
        gateway,
        user: { groups: [UserGroup.ExceptionHandler] } as User,
        caseId: 123
      })

      expect(result).toBe(true)
    })

    it("returns allowed false if the username isn't error_locked_by_id and user force is not the same as case force", async () => {
      jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser").mockResolvedValue(false)

      const result = await canUseResubmitCaseExecute({
        gateway,
        user: { groups: [UserGroup.ExceptionHandler], visible_forces: "01" } as User,
        caseId: 123
      })

      expect(result).toBe(false)
    })

    it("returns allowed true if the username is error_locked_by_id and user force is not the same as case force", async () => {
      jest.spyOn(gateway, "filterUserHasSameForceAsCaseAndLockedByUser").mockResolvedValue(true)

      const result = await canUseResubmitCaseExecute({
        gateway,
        user: { groups: [UserGroup.ExceptionHandler], visible_forces: "01" } as User,
        caseId: 123
      })

      expect(result).toBe(true)
    })
  })
})
