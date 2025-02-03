import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import EventCode from "../../types/EventCode"
import { lockExceptions } from "./lockExceptions"

describe("lockExceptions", () => {
  const fakeDataStore = new FakeDataStore()
  const sql = {} as postgres.Sql

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("adds an audit log if it succeeds", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await lockExceptions(fakeDataStore, sql, 0, user, auditLogEvents)

    expect(auditLogEvents).toHaveLength(1)
  })

  it("adds an audit log of type exception", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = {
      groups: [UserGroup.GeneralHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await lockExceptions(fakeDataStore, sql, 0, user, auditLogEvents)

    const auditEventEvent = auditLogEvents[0]
    expect(auditEventEvent.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditEventEvent.category).toBe(EventCategory.information)
    expect(auditEventEvent.attributes).toHaveProperty("user", user.username)
  })

  it("doesn't add to auditLogEvents if if fails", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(false)

    await lockExceptions(fakeDataStore, sql, 0, user, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)
  })

  it("if the user doesn't have access to exceptions", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = {
      groups: [UserGroup.TriggerHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "lockCase")

    await lockExceptions(fakeDataStore, sql, 0, user, auditLogEvents)

    expect(fakeDataStore.lockCase).not.toHaveBeenCalled()
    expect(auditLogEvents).toHaveLength(0)
  })
})
