import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"

import type { DynamoAuditLog } from "../types/AuditLog"

import { AuditLogDynamoGateway } from "../services/gateways/dynamo"
import auditLogDynamoConfig from "../tests/helpers/dynamoDbConfig"
import FakeLogger from "../tests/helpers/fakeLogger"
import { mockDynamoAuditLog } from "../tests/helpers/mockAuditLogs"
import TestDynamoGateway from "../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import ConflictError from "../types/errors/ConflictError"
import PncStatus from "../types/PncStatus"
import TriggerStatus from "../types/TriggerStatus"
import createAuditLog from "./createAuditLog"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)
const logger = new FakeLogger()

const getAuditLog = async (messageId: string): Promise<DynamoAuditLog | null> => {
  const result = await testDynamoGateway.getOne(auditLogDynamoConfig.auditLogTableName, "messageId", messageId)
  if ("Item" in result) {
    return result.Item as DynamoAuditLog
  }

  return null
}

describe("CreateAuditLogUseCase", () => {
  beforeEach(async () => {
    await testDynamoGateway.deleteAll(auditLogDynamoConfig.auditLogTableName, "messageId")
  })

  it("should return a conflict result when an Audit Log record exists with the same messageId", async () => {
    const auditLog = mockDynamoAuditLog()
    await auditLogDynamoGateway.create(auditLog)

    const result = await createAuditLog(auditLog, auditLogDynamoGateway, logger)

    expect(result).toBeInstanceOf(ConflictError)
    expect((result as Error).message).toBe(`A message with Id ${auditLog.messageId} already exists in the database`)
  })

  it("should return an error result when an unknown error occurs within the database", async () => {
    const gateway = { fetchByHash: () => new Error("Unknown error") } as unknown as AuditLogDynamoGateway

    const auditLog = mockDynamoAuditLog()
    const result = await createAuditLog(auditLog as DynamoAuditLog, gateway, logger)

    expect(result).toBeInstanceOf(Error)
    expect(result).toHaveProperty("message", "Unknown error")

    const actualAuditLog = await getAuditLog(auditLog.messageId)
    expect(actualAuditLog).toBeNull()
  })

  it("should return a success result when the record is stored in the database", async () => {
    const expectedAuditLog = mockDynamoAuditLog()

    const result = await createAuditLog(expectedAuditLog, auditLogDynamoGateway, logger)

    expect(result).toBeDefined()

    const actualAuditLog = await getAuditLog(expectedAuditLog.messageId)
    expect(actualAuditLog?.messageId).toBe(expectedAuditLog.messageId)
    expect(actualAuditLog?.externalCorrelationId).toBe(expectedAuditLog.externalCorrelationId)
    expect(actualAuditLog?.caseId).toBe(expectedAuditLog.caseId)
    expect(actualAuditLog?.receivedDate).toBe(expectedAuditLog.receivedDate)
  })

  it("should set the statuses to duplicate when audit log is a duplicate", async () => {
    const originalAuditLog = mockDynamoAuditLog()
    const duplicateAuditLog = mockDynamoAuditLog()
    duplicateAuditLog.messageHash = originalAuditLog.messageHash

    const originalResult = await createAuditLog(originalAuditLog, auditLogDynamoGateway, logger)
    expect(originalResult).toBeDefined()

    const duplicateResult = await createAuditLog(duplicateAuditLog, auditLogDynamoGateway, logger)
    expect(duplicateResult).toBeDefined()

    const originalAuditLogRecord = await getAuditLog(originalAuditLog.messageId)
    expect(originalAuditLogRecord?.messageId).toBe(originalAuditLog.messageId)
    expect(originalAuditLogRecord?.externalCorrelationId).toBe(originalAuditLog.externalCorrelationId)
    expect(originalAuditLogRecord?.caseId).toBe(originalAuditLog.caseId)
    expect(originalAuditLogRecord?.receivedDate).toBe(originalAuditLog.receivedDate)
    expect(originalAuditLogRecord?.status).toBe(AuditLogStatus.Processing)
    expect(originalAuditLogRecord?.pncStatus).toBe(PncStatus.Processing)
    expect(originalAuditLogRecord?.triggerStatus).toBe(TriggerStatus.NoTriggers)

    const duplicateAuditLogRecord = await getAuditLog(duplicateAuditLog.messageId)
    expect(duplicateAuditLogRecord?.messageId).toBe(duplicateAuditLog.messageId)
    expect(duplicateAuditLogRecord?.externalCorrelationId).toBe(duplicateAuditLog.externalCorrelationId)
    expect(duplicateAuditLogRecord?.caseId).toBe(duplicateAuditLog.caseId)
    expect(duplicateAuditLogRecord?.receivedDate).toBe(duplicateAuditLog.receivedDate)
    expect(duplicateAuditLogRecord?.status).toBe(AuditLogStatus.Duplicate)
    expect(duplicateAuditLogRecord?.pncStatus).toBe(PncStatus.Duplicate)
    expect(duplicateAuditLogRecord?.triggerStatus).toBe(TriggerStatus.Duplicate)
  })
})
