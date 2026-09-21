import type { FastifyBaseLogger } from "fastify"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

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
  createMany: jest.fn().mockResolvedValue(undefined)
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
    expect(notes[0].note_text).toContain("TRPR0001 (1)")
  })

  it("should fully complete triggers and audit log when resolving the final open trigger", async () => {
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
    expect(caseRecord[0].resolution_ts).not.toBeNull()

    // Should have events for resolving the trigger and for all triggers resolved
    expect(mockAuditLogGateway.createMany).toHaveBeenCalled()
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
    expect((result as Error).message).toContain(`Couldn't fetch case id ${nonExistentCaseId} for user ${user.username}`)
  })
})
