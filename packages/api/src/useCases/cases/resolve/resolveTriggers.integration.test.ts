import type { User } from "@moj-bichard7/common/types/User"

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
import { resolveTriggers } from "./resolveTriggers"

const testDatabaseGateway = new End2EndPostgres()

describe("updateTriggers", () => {
  let auditLogEvents: ApiAuditLogEvent[]
  let user: User
  let triggersToResolve: { triggerCode: string; triggerId: number; triggerItemIdentity: number | undefined }[]
  let triggerIds: number[]

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    auditLogEvents = []
    user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })

    triggersToResolve = [
      { triggerCode: "TRPR0001", triggerId: 1, triggerItemIdentity: 1 },
      { triggerCode: "TRPR0002", triggerId: 2, triggerItemIdentity: undefined }
    ]
    triggerIds = triggersToResolve.map((trigger) => trigger.triggerId)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should successfully resolve unresolved triggers and append an audit log event", async () => {
    const caseObj = await createCase(testDatabaseGateway)

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: "TRPR0001", triggerId: triggerIds[0] },
      { triggerCode: "TRPR0002", triggerId: triggerIds[1] }
    ])

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await resolveTriggers(tx, user, triggersToResolve, auditLogEvents)
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
    const caseObj = await createCase(testDatabaseGateway)

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      {
        resolvedAt: new Date(),
        resolvedBy: "someone_else",
        status: ResolutionStatusNumber.Resolved,
        triggerCode: "TRPR0001",
        triggerId: triggerIds[0]
      }
    ])

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await resolveTriggers(tx, user, triggersToResolve, auditLogEvents)
    })

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(UnprocessableEntityError)
    expect((result as Error).message).toContain(`Couldn't update triggers ids: ${triggerIds.join(",")}`)
    expect(auditLogEvents).toHaveLength(0)
  })

  it("should return an error if the database query fails", async () => {
    const brokenTx = {
      connection: jest.fn().mockImplementation((stringsOrData) => {
        if (Array.isArray(stringsOrData)) {
          return Promise.reject(new Error("Simulated Database Error"))
        }

        return "mocked_fields"
      })
    }

    const result = await resolveTriggers(brokenTx as any, user, triggersToResolve, auditLogEvents)

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toContain(
      `Couldn't update triggers trigger ids:${triggerIds}: Simulated Database Error`
    )

    expect(auditLogEvents).toHaveLength(0)
  })
})
