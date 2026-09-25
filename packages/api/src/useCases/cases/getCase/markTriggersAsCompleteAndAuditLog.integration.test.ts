import type { TriggerRow } from "@moj-bichard7/common/types/Trigger"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import { markTriggersAsCompleteAndAuditLog } from "./markTriggersAsCompleteAndAuditLog"

const testDatabaseGateway = new End2EndPostgres()

describe("markTriggersAsCompleteAndAuditLog", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should mark triggers as complete, set resolution_ts, and create an audit log when there are no unresolved exceptions", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, { triggerResolvedBy: null })

    const allTriggers = [
      { trigger_code: "TRPR0001", trigger_item_identity: 1 },
      { trigger_code: "TRPR0002", trigger_item_identity: null }
    ] as TriggerRow[]

    let result: Error | number | undefined
    const hasUnresolvedExceptions = false

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await markTriggersAsCompleteAndAuditLog(
        tx,
        caseObj.errorId,
        hasUnresolvedExceptions,
        user,
        allTriggers,
        auditLogEvents
      )
    })

    expect(isError(result)).toBe(false)
    expect(result).toBe(1)

    expect(auditLogEvents).toHaveLength(1)
    const auditEvent = auditLogEvents[0]
    expect(auditEvent.eventCode).toBe(EventCode.AllTriggersResolved)
    expect(auditEvent.category).toBe(EventCategory.information)
    expect(auditEvent.attributes).toHaveProperty("user", "test_user")
    expect(auditEvent.attributes).toHaveProperty("Number Of Triggers", 2)
    expect(auditEvent.attributes).toHaveProperty("Trigger 1 Details", "TRPR0001 (1)")
    expect(auditEvent.attributes).toHaveProperty("Trigger 2 Details", "TRPR0002")

    const updatedCase = await testDatabaseGateway.writable.connection`
      SELECT trigger_status, trigger_resolved_by, trigger_resolved_ts, resolution_ts 
      FROM br7own.error_list
      WHERE error_id = ${caseObj.errorId}
    `
    expect(updatedCase).toHaveLength(1)
    expect(updatedCase[0].trigger_status).toBe(ResolutionStatusNumber.Resolved)
    expect(updatedCase[0].trigger_resolved_by).toBe("test_user")
    expect(updatedCase[0].trigger_resolved_ts).not.toBeNull()
    expect(updatedCase[0].resolution_ts).not.toBeNull()
  })

  it("should mark triggers as complete but leave resolution_ts as null when there ARE unresolved exceptions", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, { triggerResolvedBy: null })
    const allTriggers = [] as TriggerRow[]

    let result: Error | number | undefined
    const hasUnresolvedExceptions = true

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await markTriggersAsCompleteAndAuditLog(
        tx,
        caseObj.errorId,
        hasUnresolvedExceptions,
        user,
        allTriggers,
        auditLogEvents
      )
    })

    expect(isError(result)).toBe(false)
    expect(result).toBe(1)

    const updatedCase = await testDatabaseGateway.writable.connection`
      SELECT trigger_status, trigger_resolved_by, trigger_resolved_ts, resolution_ts
      FROM br7own.error_list
      WHERE error_id = ${caseObj.errorId}
    `

    expect(updatedCase[0].trigger_status).toBe(ResolutionStatusNumber.Resolved)
    expect(updatedCase[0].trigger_resolved_by).toBe("test_user")
    expect(updatedCase[0].trigger_resolved_ts).not.toBeNull()
    expect(updatedCase[0].resolution_ts).toBeNull()
  })

  it("should return an UnprocessableEntityError if the case triggers are already marked as complete", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, { triggerResolvedBy: "someone_else" })
    const allTriggers = [] as TriggerRow[]

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await markTriggersAsCompleteAndAuditLog(tx, caseObj.errorId, false, user, allTriggers, auditLogEvents)
    })

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(UnprocessableEntityError)
    expect((result as Error).message).toContain(`Couldn't update triggers for case ${caseObj.errorId}`)
    expect(auditLogEvents).toHaveLength(0)
  })

  it("should return an error if the database query fails", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const courtCaseId = 123
    const allTriggers = [] as TriggerRow[]

    const brokenTx = {
      connection: jest.fn().mockImplementation((stringsOrData) => {
        if (Array.isArray(stringsOrData)) {
          return Promise.reject(new Error("Simulated Database Error"))
        }

        return "mocked_fields"
      })
    }

    const result = await markTriggersAsCompleteAndAuditLog(
      brokenTx as any,
      courtCaseId,
      false,
      user,
      allTriggers,
      auditLogEvents
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toContain("Couldn't complete triggers for case 123: Simulated Database Error")
    expect(auditLogEvents).toHaveLength(0)
  })
})
