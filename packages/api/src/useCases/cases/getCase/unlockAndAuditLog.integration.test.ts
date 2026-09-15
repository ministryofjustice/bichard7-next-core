import EventCode from "@moj-bichard7/common/types/EventCode"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { ForbiddenError } from "../../../types/errors/ForbiddenError"
import { unlockAndAuditLog } from "./unlockAndAuditLog"

describe("unlockAndAuditLog integration", () => {
  let databaseGateway: End2EndPostgres

  beforeAll(() => {
    databaseGateway = new End2EndPostgres()
  })

  beforeEach(async () => {
    await databaseGateway.clearDb()
  })

  afterAll(async () => {
    await databaseGateway.close()
  })

  describe("Permission checks", () => {
    it("returns ForbiddenError if user lacks permission to unlock exceptions", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.TriggerHandler],
        id: 1
      })
      const auditLogEvents: ApiAuditLogEvent[] = []
      const caseObj = await createCase(databaseGateway)

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          1,
          UnlockReason.Exception,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeInstanceOf(ForbiddenError)
      expect((result as ForbiddenError).message).toBe("User does not have permission to unlock exceptions")
      expect(auditLogEvents).toHaveLength(0)
    })

    it("returns ForbiddenError if user lacks permission to unlock triggers", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.ExceptionHandler],
        id: 1
      })
      const auditLogEvents: ApiAuditLogEvent[] = []
      const caseObj = await createCase(databaseGateway)

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          1,
          UnlockReason.Trigger,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeInstanceOf(ForbiddenError)
      expect((result as ForbiddenError).message).toBe("User does not have permission to unlock triggers")
      expect(auditLogEvents).toHaveLength(0)
    })

    it("returns ForbiddenError if user attempts to unlock triggers and exceptions but only has exceptions permission", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.ExceptionHandler],
        id: 1
      })
      const auditLogEvents: ApiAuditLogEvent[] = []
      const caseObj = await createCase(databaseGateway)

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          1,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeInstanceOf(ForbiddenError)
      expect((result as ForbiddenError).message).toBe("User does not have permission to unlock triggers and exceptions")
      expect(auditLogEvents).toHaveLength(0)
    })

    it("returns ForbiddenError if user attempts to unlock triggers and exceptions but only has triggers permission", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.TriggerHandler],
        id: 1
      })
      const auditLogEvents: ApiAuditLogEvent[] = []
      const caseObj = await createCase(databaseGateway)

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          1,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeInstanceOf(ForbiddenError)
      expect((result as ForbiddenError).message).toBe("User does not have permission to unlock triggers and exceptions")
      expect(auditLogEvents).toHaveLength(0)
    })

    it("returns ForbiddenError if service user attempts to unlock case", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.Service],
        id: 1
      })
      const auditLogEvents: ApiAuditLogEvent[] = []
      const caseObj = await createCase(databaseGateway)

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          1,
          UnlockReason.Trigger,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeInstanceOf(ForbiddenError)
      expect((result as ForbiddenError).message).toBe(
        "Service user does not have permission to unlock exceptions or triggers"
      )
      expect(auditLogEvents).toHaveLength(0)
    })
  })

  describe("When lock is present", () => {
    it("unlocks exceptions and audit logs event when user has exceptions permission", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.ExceptionHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: user.username
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.Exception,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()

      const [dbCase] = await databaseGateway.writable.connection`
          SELECT error_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
        `
      expect(dbCase.error_locked_by_id).toBeNull()

      expect(auditLogEvents).toHaveLength(1)
      expect(auditLogEvents[0].eventCode).toBe(EventCode.ExceptionsUnlocked)
      expect(auditLogEvents[0].attributes).toMatchObject({ user: user.username })
    })

    it("unlocks triggers and audit logs event when user has triggers permission", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.TriggerHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        triggerLockedById: user.username
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.Trigger,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()

      const [dbCase] = await databaseGateway.writable.connection`
          SELECT trigger_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
        `
      expect(dbCase.trigger_locked_by_id).toBeNull()

      expect(auditLogEvents).toHaveLength(1)
      expect(auditLogEvents[0].eventCode).toBe(EventCode.TriggersUnlocked)
      expect(auditLogEvents[0].attributes).toMatchObject({ user: user.username })
    })

    it("unlocks triggers and exceptions and audit logs both events when user is a GeneralHandler", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.GeneralHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: user.username,
        triggerLockedById: user.username
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()

      const [dbCase] = await databaseGateway.writable.connection`
          SELECT error_locked_by_id, trigger_locked_by_id FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
        `
      expect(dbCase.error_locked_by_id).toBeNull()
      expect(dbCase.trigger_locked_by_id).toBeNull()

      expect(auditLogEvents).toHaveLength(2)
      expect(auditLogEvents[0].eventCode).toBe(EventCode.ExceptionsUnlocked)
      expect(auditLogEvents[1].eventCode).toBe(EventCode.TriggersUnlocked)
    })
  })

  describe("When lock is not present", () => {
    it("does not attempt to unlock exceptions or log audit event when exceptions are not locked", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.ExceptionHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: null
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.Exception,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()
      expect(auditLogEvents).toHaveLength(0)
    })

    it("does not attempt to unlock triggers or log audit event when triggers are not locked", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.TriggerHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        triggerLockedById: null
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.Trigger,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()
      expect(auditLogEvents).toHaveLength(0)
    })

    it("does not log any audit events when unlocking TriggerAndException but neither is locked", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.GeneralHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: null,
        triggerLockedById: null
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()
      expect(auditLogEvents).toHaveLength(0)
    })

    it("only unlocks and logs triggers, when unlocking TriggerAndException, but only triggers are locked", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.GeneralHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: null,
        triggerLockedById: user.username
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()
      expect(auditLogEvents).toHaveLength(1)
      expect(auditLogEvents[0].eventCode).toBe(EventCode.TriggersUnlocked)
    })

    it("only unlocks and logs exceptions, when unlocking TriggerAndException, but only exceptions are locked", async () => {
      const user = await createUser(databaseGateway, {
        groups: [UserGroup.GeneralHandler],
        id: 1
      })
      const caseObj = await createCase(databaseGateway, {
        errorLockedById: user.username,
        triggerLockedById: null
      })
      const auditLogEvents: ApiAuditLogEvent[] = []

      const result = await databaseGateway.writable.transaction((tx) =>
        unlockAndAuditLog(
          tx,
          user,
          caseObj.errorId,
          UnlockReason.TriggerAndException,
          auditLogEvents,
          caseObj.errorLockedById,
          caseObj.triggerLockedById
        )
      )

      expect(result).toBeUndefined()
      expect(auditLogEvents).toHaveLength(1)
      expect(auditLogEvents[0].eventCode).toBe(EventCode.ExceptionsUnlocked)
    })
  })
})
