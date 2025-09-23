import type { RowList } from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { lockTriggers } from "./lockTriggers"

const testDatabaseGateway = new End2EndPostgres()

describe("lockTriggers", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("locks the triggers and generate an audit log event when user has permission to handle triggers", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler] })
    const caseObj = await createCase(testDatabaseGateway)
    const auditLogEvents: ApiAuditLogEvent[] = []

    await lockTriggers(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    expect(auditLogEvents).toHaveLength(1)
    const auditLogEvent = auditLogEvents[0]
    expect(auditLogEvent.category).toBe(EventCategory.information)
    expect(auditLogEvent.eventCode).toBe(EventCode.TriggersLocked)
    expect(auditLogEvent.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent.attributes?.user).toBe(user.username)
  })

  it("does not lock the trigger when user lacks permission to handle triggers", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway)
    const auditLogEvents: ApiAuditLogEvent[] = []

    await lockTriggers(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)
  })

  it("doesn't update audit logs when trigger locking fails", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway)
    const auditLogEvents: ApiAuditLogEvent[] = []
    const databaseGatewayMock = jest
      .spyOn(testDatabaseGateway.writable, "connection")
      .mockResolvedValue(Error("Dummy Trigger Error") as unknown as RowList<readonly (object | undefined)[]>)

    await lockTriggers(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)

    databaseGatewayMock.mockClear()
  })
})
