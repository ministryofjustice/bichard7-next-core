import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import EventCode from "../../types/EventCode"
import { lockExceptions } from "./lockExceptions"

describe("lockExceptions", () => {
  const fakeDataStore = new FakeDataStore()
  const sql = {} as postgres.Sql

  it("adds an audit log if it succeeds", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await lockExceptions(fakeDataStore, sql, 0, "user1", auditLogEvents)

    expect(auditLogEvents).toHaveLength(1)
  })

  it("adds an audit log of type exception", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await lockExceptions(fakeDataStore, sql, 0, "user1", auditLogEvents)

    const auditEventEvent = auditLogEvents[0]
    expect(auditEventEvent.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditEventEvent.category).toBe(EventCategory.information)
    expect(auditEventEvent.attributes).toHaveProperty("user", "user1")
  })

  it("doesn't add to auditLogEvents if if fails", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(false)

    await lockExceptions(fakeDataStore, sql, 0, "user1", auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)
  })
})
