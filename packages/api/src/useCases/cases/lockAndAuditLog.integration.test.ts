import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type { OutputApiAuditLog } from "../../types/AuditLog"
import type { CaseMessageId } from "../../types/Case"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import auditLogDynamoConfig from "../../tests/helpers/dynamoDbConfig"
import { mockInputApiAuditLog } from "../../tests/helpers/mockAuditLogs"
import { minimalUser } from "../../tests/helpers/userHelper"
import TestDynamoGateway from "../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import createAuditLog from "../createAuditLog"
import FetchById from "../fetchAuditLogs/FetchById"
import { lockAndAuditLog } from "./lockAndAuditLog"

describe("lockAndAuditLog", () => {
  const fakeDataStore = new FakeDataStore()
  const caseId = 0
  const sql = {} as postgres.Sql
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeEach(async () => {
    await testDynamoGateway.clearDynamo()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("locks the exception to the current user and creates an audit log", async () => {
    const user = minimalUser()
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })
    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest
      .spyOn(fakeDataStore, "selectCaseMessageId")
      .mockResolvedValue({ message_id: messageId } satisfies CaseMessageId)
    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).resolves.not.toThrow()

    const auditLogJson = await new FetchById(testDynamoGateway, messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]

    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent?.user).toBe(user.username)
  })

  it("locks the trigger to the current user and creates an audit log", async () => {
    const user = minimalUser([UserGroup.TriggerHandler])
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })
    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest
      .spyOn(fakeDataStore, "selectCaseMessageId")
      .mockResolvedValue({ message_id: messageId } satisfies CaseMessageId)
    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).resolves.not.toThrow()

    const auditLogJson = await new FetchById(testDynamoGateway, messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]

    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.TriggersLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent?.user).toBe(user.username)
  })

  it("does not attempt to lock the exceptions or triggers when user lacks permission to handle exceptions and triggers", async () => {
    const user = minimalUser([UserGroup.Audit])
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })

    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest.spyOn(fakeDataStore, "lockCase")

    await lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)

    expect(fakeDataStore.lockCase).not.toHaveBeenCalled()
  })

  it("does not create audit log events when case is not locked", async () => {
    const user = minimalUser()
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })

    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(false)

    await lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)

    const auditLogJson = await new FetchById(testDynamoGateway, messageId).fetch()
    expect(auditLogJson).toBeDefined()

    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(0)
  })

  it("Throws an error when messageId is not retrieved", async () => {
    const user = minimalUser()

    jest.spyOn(fakeDataStore, "selectCaseMessageId").mockRejectedValue(new Error("No message id found"))

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow(
      "No message id found"
    )
  })

  it("Throws an error when case locking fails", async () => {
    const user = minimalUser()

    jest.spyOn(fakeDataStore, "lockCase").mockRejectedValue(new Error())

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow()
  })

  it("Throws an error when audit logging fails", async () => {
    const user = minimalUser()

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow(
      "A message with Id ABC does not exist in the database"
    )
  })
})
