import type { FastifyBaseLogger } from "fastify"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"

import { createCase } from "../../tests/helpers/caseHelper"
import { createTriggers } from "../../tests/helpers/triggerHelper"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { NotFoundError } from "../../types/errors/NotFoundError"
import resolveTriggers from "./resolveTriggers"

const testDatabaseGateway = new End2EndPostgres()

const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
} as unknown as FastifyBaseLogger

const mockAuditLogGateway = {
  fetchOne: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true)
} as unknown as AuditLogDynamoGateway

describe("resolveTriggers", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    jest.clearAllMocks()
  })

  it("should resolve a single trigger and add a system note when other triggers are still unresolved", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })

    const caseObj = await createCase(testDatabaseGateway, {
      triggerLockedById: user.username
    })

    const insertedTriggers = [
      { triggerCode: "TRPR0001", triggerId: 1 },
      { triggerCode: "TRPR0002", triggerId: 2 } // This trigger will stay unresolved
    ]

    await createTriggers(testDatabaseGateway, caseObj.errorId, insertedTriggers)

    const triggerToResolve = insertedTriggers[0].triggerId

    const result = await resolveTriggers(
      testDatabaseGateway.writable,
      mockLogger,
      [triggerToResolve],
      caseObj.errorId,
      user,
      mockAuditLogGateway
    )

    expect(isError(result)).toBe(false)

    const updatedTriggers = await testDatabaseGateway.writable.connection`
      SELECT trigger_id, status, resolved_by FROM br7own.error_list_triggers WHERE error_id = ${caseObj.errorId} ORDER BY trigger_id
    `
    expect(updatedTriggers[0].status).toBe(ResolutionStatusNumber.Resolved)
    expect(updatedTriggers[0].resolved_by).toBe("test_user")

    expect(updatedTriggers[1].status).toBe(ResolutionStatusNumber.Unresolved)

    const caseRecord = await testDatabaseGateway.writable.connection`
      SELECT resolution_ts FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(caseRecord[0].resolution_ts).toBeNull()

    const notes = await testDatabaseGateway.writable.connection`
      SELECT note_text, user_id FROM br7own.error_list_notes WHERE error_id = ${caseObj.errorId}
    `
    expect(notes.length).toBeGreaterThan(0)
    expect(notes[0].user_id).toBe("System")

    const shortTrigger = getShortTriggerCode(insertedTriggers[0].triggerCode)
    expect(notes[0].note_text).toContain(`${user.username}: Portal Action: Resolved Trigger. Code: ${shortTrigger}`)
  })

  it("should fully complete triggers and audit log when all triggers are resolved", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, {
      errorCount: 0,
      errorLockedById: null,
      errorStatus: null,
      triggerLockedById: user.username
    })

    const insertedTriggers = [{ triggerCode: "TRPR0001", triggerId: 1 }]
    await createTriggers(testDatabaseGateway, caseObj.errorId, insertedTriggers)

    const result = await resolveTriggers(
      testDatabaseGateway.writable,
      mockLogger,
      [insertedTriggers[0].triggerId],
      caseObj.errorId,
      user,
      mockAuditLogGateway
    )

    expect(isError(result)).toBe(false)

    const caseRecord = await testDatabaseGateway.writable.connection`
      SELECT trigger_status, resolution_ts FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(caseRecord[0].trigger_status).toBe(ResolutionStatusNumber.Resolved)
    expect(caseRecord[0].resolution_ts).not.toBeNull()

    expect(mockAuditLogGateway.update).toHaveBeenCalled()
  })

  it("should not have a resolution timestamp if triggers are resolved but there are unresolved exceptions", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, { triggerLockedById: user.username })

    const insertedTriggers = [{ triggerCode: "TRPR0001", triggerId: 1 }]
    await createTriggers(testDatabaseGateway, caseObj.errorId, insertedTriggers)

    const result = await resolveTriggers(
      testDatabaseGateway.writable,
      mockLogger,
      [insertedTriggers[0].triggerId],
      caseObj.errorId,
      user,
      mockAuditLogGateway
    )

    expect(isError(result)).toBe(false)

    const caseRecord = await testDatabaseGateway.writable.connection`
      SELECT trigger_status, resolution_ts FROM br7own.error_list WHERE error_id = ${caseObj.errorId}
    `
    expect(caseRecord[0].trigger_status).toBe(ResolutionStatusNumber.Resolved)
    expect(caseRecord[0].resolution_ts).toBeNull()

    expect(mockAuditLogGateway.update).toHaveBeenCalled()
  })

  it("should return a NotFoundError if no matching unresolved triggers exist", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const caseObj = await createCase(testDatabaseGateway, { triggerLockedById: user.username })

    const result = await resolveTriggers(
      testDatabaseGateway.writable,
      mockLogger,
      [9999],
      caseObj.errorId,
      user,
      mockAuditLogGateway
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("should throw an error if the case does not exist", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
    const nonExistentCaseId = 999

    const result = await resolveTriggers(
      testDatabaseGateway.writable,
      mockLogger,
      [1],
      nonExistentCaseId,
      user,
      mockAuditLogGateway
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toContain(`Case id ${nonExistentCaseId} for user ${user.username} not found`)
  })
})
