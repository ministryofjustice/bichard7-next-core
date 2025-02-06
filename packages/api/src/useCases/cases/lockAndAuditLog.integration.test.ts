import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type { OutputApiAuditLog } from "../../types/AuditLog"
import type { CaseMessageId } from "../../types/Case"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import auditLogDynamoConfig from "../../tests/helpers/dynamoDbConfig"
import { mockInputApiAuditLog } from "../../tests/helpers/mockAuditLogs"
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
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })
    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest
      .spyOn(fakeDataStore, "selectCaseMessageId")
      .mockResolvedValue({ message_id: messageId } satisfies CaseMessageId)
    jest.spyOn(fakeDataStore, "lockCase").mockResolvedValue(true)

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).resolves.not.toThrow()
  })

  it("does not attempt to lock if the user doesn't have permission to lock the case", async () => {
    const user = {
      groups: [UserGroup.TriggerHandler],
      username: "user1"
    } as User
    const messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })

    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest.spyOn(fakeDataStore, "lockCase")

    await lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)

    expect(fakeDataStore.lockCase).not.toHaveBeenCalled()
  })

  it("does not create audit log events if the exception is not locked", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User
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
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "selectCaseMessageId").mockRejectedValue(new Error("No message id found"))

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow(
      "No message id found"
    )
  })

  it("Throws an error when exception locking fails", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User

    jest.spyOn(fakeDataStore, "lockCase").mockRejectedValue(new Error())

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow()
  })

  it("Throws an error when audit logging fails", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1"
    } as User

    await expect(lockAndAuditLog(fakeDataStore, caseId, sql, user, auditLogDynamoGateway)).rejects.toThrow(
      "A message with Id ABC does not exist in the database"
    )
  })
})
