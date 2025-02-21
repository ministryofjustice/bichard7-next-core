import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type { CaseMessageId } from "../../types/Case"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import auditLogDynamoConfig from "../../tests/helpers/dynamoDbConfig"
import FakeLogger from "../../tests/helpers/fakeLogger"
import { mockInputApiAuditLog } from "../../tests/helpers/mockAuditLogs"
import { minimalUser } from "../../tests/helpers/userHelper"
import TestDynamoGateway from "../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import createAuditLog from "../createAuditLog"
import { lockAndFetchCase } from "./lockAndFetchCase"

describe("lockAndFetchCase", () => {
  const fakeDataStore = new FakeDataStore()
  const caseId = 0
  const fakeLogger = new FakeLogger()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  let messageId: string

  beforeEach(async () => {
    await testDynamoGateway.clearDynamo()

    messageId = randomUUID()
    const expectedAuditLog = mockInputApiAuditLog({ caseId: "0", messageId })
    await createAuditLog(expectedAuditLog, auditLogDynamoGateway)

    jest.spyOn(auditLogDynamoGateway, "fetchOne")
    jest.spyOn(fakeLogger, "error")
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns a case", async () => {
    const user = minimalUser()

    jest
      .spyOn(fakeDataStore, "selectCaseMessageId")
      .mockResolvedValue({ message_id: messageId } satisfies CaseMessageId)

    const result = await lockAndFetchCase(fakeDataStore, auditLogDynamoGateway, caseId, user, fakeLogger)

    expect(auditLogDynamoGateway.fetchOne).toHaveBeenCalled()
    expect(fakeLogger.error).not.toHaveBeenCalled()
    expect(result.error_id).toBe(0)
  })

  it("does not error when given a user doesn't have access to exceptions or triggers", async () => {
    const user = minimalUser([UserGroup.Audit])

    const result = await lockAndFetchCase(fakeDataStore, auditLogDynamoGateway, caseId, user, fakeLogger)

    expect(auditLogDynamoGateway.fetchOne).not.toHaveBeenCalled()
    expect(fakeLogger.error).not.toHaveBeenCalled()
    expect(result.error_id).toBe(0)
  })

  it("handles an error from not having a message id", async () => {
    const user = minimalUser()

    jest.spyOn(fakeDataStore, "selectCaseMessageId").mockRejectedValue(new Error("No message id found"))

    const result = await lockAndFetchCase(fakeDataStore, auditLogDynamoGateway, caseId, user, fakeLogger)

    expect(auditLogDynamoGateway.fetchOne).not.toHaveBeenCalled()
    expect(fakeLogger.error).toHaveBeenCalled()
    expect(result.error_id).toBe(0)
  })

  it("handles an error if the lock doesn't work", async () => {
    const user = minimalUser()

    jest.spyOn(fakeDataStore, "lockCase").mockRejectedValue(new Error())

    const result = await lockAndFetchCase(fakeDataStore, auditLogDynamoGateway, caseId, user, fakeLogger)

    expect(auditLogDynamoGateway.fetchOne).not.toHaveBeenCalled()
    expect(fakeLogger.error).toHaveBeenCalled()
    expect(result.error_id).toBe(0)
  })

  it("handles an error if audit log errors", async () => {
    const user = minimalUser()

    jest.spyOn(auditLogDynamoGateway, "fetchOne").mockRejectedValue(new Error())

    const result = await lockAndFetchCase(fakeDataStore, auditLogDynamoGateway, caseId, user, fakeLogger)

    expect(auditLogDynamoGateway.fetchOne).toHaveBeenCalled()
    expect(fakeLogger.error).toHaveBeenCalled()
    expect(result.error_id).toBe(0)
  })
})
