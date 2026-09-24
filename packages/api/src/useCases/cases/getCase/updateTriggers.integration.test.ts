import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import { updateTriggers } from "./updateTriggers"

const testDatabaseGateway = new End2EndPostgres()

describe("updateTriggers", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should successfully resolve unresolved triggers and append an audit log event", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })

    const caseObj = await createCase(testDatabaseGateway)
    const triggerIds = [1, 2]

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: "TRPR0001", triggerId: triggerIds[0] },
      { triggerCode: "TRPR0002", triggerId: triggerIds[1] }
    ])

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await updateTriggers(tx, user, triggerIds, auditLogEvents)
    })

    expect(isError(result)).toBe(false)
    expect(result).toBe(2)

    expect(auditLogEvents).toHaveLength(1)
    const auditEvent = auditLogEvents[0]
    expect(auditEvent.eventCode).toBe(EventCode.TriggersResolved)
    expect(auditEvent.category).toBe(EventCategory.information)
    expect(auditEvent.attributes).toHaveProperty("user", "test_user")
    expect(auditEvent.attributes).toHaveProperty("Number Of Triggers", 2)

    const triggerRecords = await testDatabaseGateway.writable
      .connection`SELECT status, resolved_by, resolved_ts FROM br7own.error_list_triggers WHERE trigger_id IN (${triggerIds[0]}, ${triggerIds[1]})`

    expect(triggerRecords).toHaveLength(2)
    expect(triggerRecords[0].status).toBe(ResolutionStatusNumber.Resolved)
    expect(triggerRecords[0].resolved_by).toBe("test_user")
    expect(triggerRecords[0].resolved_ts).not.toBeNull()
  })

  it("should return an UnprocessableEntityError if the trigger is already resolved", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway)
    const triggerId = 1

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      {
        resolvedAt: new Date(),
        resolvedBy: "someone_else",
        status: ResolutionStatusNumber.Resolved,
        triggerCode: "TRPR0001",
        triggerId: triggerId
      }
    ])

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await updateTriggers(tx, user, [triggerId], auditLogEvents)
    })

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(UnprocessableEntityError)
    expect((result as Error).message).toContain(`Couldn't update triggers ids: ${triggerId}`)
    expect(auditLogEvents).toHaveLength(0)
  })

  it("should return an error if the database query fails", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const triggerIds = [1, 2]

    const brokenTx = {
      connection: jest.fn().mockImplementation((stringsOrData) => {
        if (Array.isArray(stringsOrData)) {
          return Promise.reject(new Error("Simulated Database Error"))
        }

        return "mocked_fields"
      })
    }

    const result = await updateTriggers(brokenTx as any, user, triggerIds, auditLogEvents)

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toContain(
      `Couldn't update triggers trigger ids:${triggerIds}: Simulated Database Error`
    )

    expect(auditLogEvents).toHaveLength(0)
  })
})
