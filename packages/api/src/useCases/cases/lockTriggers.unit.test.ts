import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import FakeDataStore from "../../services/gateways/database/FakeDatabase"
import { minimalUser } from "../../tests/helpers/userHelper"
import { lockTriggers } from "./lockTriggers"

describe("lockTriggers", () => {
  const fakeDataStore = new FakeDataStore()
  const callbackSql = {} as postgres.Sql
  const caseId = 0

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("calls lockCase and updates audit log when user has permission to handle triggers", async () => {
    const user = minimalUser([UserGroup.TriggerHandler])
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase")

    await lockTriggers(fakeDataStore, callbackSql, caseId, user, auditLogEvents)

    expect(fakeDataStore.lockCase).toHaveBeenCalled()
    expect(auditLogEvents).toHaveLength(1)
  })

  it("does not call lockCase and update audit log when user lacks permission to handle triggers", async () => {
    const user = minimalUser([UserGroup.ExceptionHandler])
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase")

    await lockTriggers(fakeDataStore, callbackSql, caseId, user, auditLogEvents)

    expect(fakeDataStore.lockCase).not.toHaveBeenCalled()
    expect(auditLogEvents).toHaveLength(0)
  })

  it("updates audit logs when trigger is locked successfully", async () => {
    const user = minimalUser([UserGroup.TriggerHandler])
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await lockTriggers(fakeDataStore, callbackSql, caseId, user, auditLogEvents)

    expect(auditLogEvents).toHaveLength(1)

    const auditLogEvent = auditLogEvents[0]
    expect(auditLogEvent.category).toBe(EventCategory.information)
    expect(auditLogEvent.eventCode).toBe(EventCode.TriggersLocked)
    expect(auditLogEvent.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent.attributes?.user).toBe(user.username)
  })

  it("doesn't update audit logs when trigger locking fails", async () => {
    const user = minimalUser([UserGroup.TriggerHandler])
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(false)

    await lockTriggers(fakeDataStore, callbackSql, caseId, user, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)
  })
})
