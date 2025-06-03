import type { RowList } from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import { createCase } from "../../tests/helpers/caseHelper"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { lockExceptions } from "./lockExceptions"

const testDatabaseGateway = new End2EndPostgres()

describe("lockExceptions", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("adds an audit log if it succeeds", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler], username: "user1" })
    const caseObj = await createCase(testDatabaseGateway)

    await lockExceptions(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    const auditEventEvent = auditLogEvents[0]
    expect(auditEventEvent.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditEventEvent.category).toBe(EventCategory.information)
    expect(auditEventEvent.attributes).toHaveProperty("user", user.username)
  })

  it("if the user doesn't have access to exceptions", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "user1" })
    const caseObj = await createCase(testDatabaseGateway)

    await lockExceptions(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)
  })

  it("doesn't add to auditLogEvents if it fails to lock the exceptions", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, {
      groups: [UserGroup.ExceptionHandler],
      visibleForces: [2]
    })
    const caseObj = await createCase(testDatabaseGateway, { orgForPoliceFilter: [2] })
    const databaseGatewayMock = jest
      .spyOn(testDatabaseGateway.writable, "connection")
      .mockResolvedValue(Error("Dummy Error") as unknown as RowList<readonly (object | undefined)[]>)

    await lockExceptions(testDatabaseGateway.writable, user, caseObj.errorId, auditLogEvents)

    expect(auditLogEvents).toHaveLength(0)

    databaseGatewayMock.mockClear()
  })
})
