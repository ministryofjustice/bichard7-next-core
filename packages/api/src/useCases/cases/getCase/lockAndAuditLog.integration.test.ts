import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import lockException from "../../../services/db/cases/lockException"
import lockTrigger from "../../../services/db/cases/lockTrigger"
import { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import createAuditLogEvents from "../../createAuditLogEvents"
import FetchById from "../../fetchAuditLogs/FetchById"
import { lockAndAuditLog } from "./lockAndAuditLog"

jest.mock("../../../services/db/cases/lockException")
jest.mock("../../../services/db/cases/lockTrigger")
jest.mock("../../createAuditLogEvents")

const mockedLockException = lockException as jest.Mock
const mockedLockTrigger = lockTrigger as jest.Mock
const mockedCreateAuditLogEvents = createAuditLogEvents as jest.Mock

describe("lockAndAuditLog", () => {
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()
    mockedLockException.mockImplementation(jest.requireActual("../../../services/db/cases/lockException").default)
    mockedLockTrigger.mockImplementation(jest.requireActual("../../../services/db/cases/lockTrigger").default)
    mockedCreateAuditLogEvents.mockImplementation(jest.requireActual("../../createAuditLogEvents").default)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("locks the exception to the current user and creates an audit log", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, triggerLockedById: "another-user" })

    const result = await lockAndAuditLog(testDatabaseGateway.writable, testDynamoGateway, user, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`
    expect(updatedCase[0].error_locked_by_id).toBe(user.username)
    expect(updatedCase[0].trigger_locked_by_id).toBe("another-user")

    const auditLogJson = await new FetchById(testDynamoGateway, caseObj.messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]
    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent?.user).toBe(user.username)
  })

  it("locks the trigger to the current user and creates an audit log", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: "another-user", triggerLockedById: null })

    const result = await lockAndAuditLog(testDatabaseGateway.writable, testDynamoGateway, user, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`
    expect(updatedCase[0].error_locked_by_id).toBe("another-user")
    expect(updatedCase[0].trigger_locked_by_id).toBe(user.username)

    const auditLogJson = await new FetchById(testDynamoGateway, caseObj.messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]
    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.TriggersLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard New UI")
    expect(auditLogEvent?.user).toBe(user.username)
  })

  it("does not attempt to lock the exceptions or triggers when user lacks permission to handle exceptions and triggers", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Audit] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, triggerLockedById: null })

    const result = await lockAndAuditLog(testDatabaseGateway.writable, testDynamoGateway, user, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`
    expect(updatedCase[0].error_locked_by_id).toBeNull()
    expect(updatedCase[0].trigger_locked_by_id).toBeNull()

    const auditLogJson = await new FetchById(testDynamoGateway, caseObj.messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(0)
  })

  it("does not create audit log events when case is not locked", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Audit] })
    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: "another-user",
      triggerLockedById: "another-user-2"
    })

    const result = await lockAndAuditLog(testDatabaseGateway.writable, testDynamoGateway, user, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`
    expect(updatedCase[0].error_locked_by_id).toBe("another-user")
    expect(updatedCase[0].trigger_locked_by_id).toBe("another-user-2")

    const auditLogJson = await new FetchById(testDynamoGateway, caseObj.messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(0)
  })

  it("returns an error when messageId is not retrieved", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseId = 20

    const result = await lockAndAuditLog(testDatabaseGateway.writable, auditLogDynamoGateway, user, caseId)

    expect((result as Error).message).toBe("Case not found for Case id 20 and user User1")
  })

  it("returns an error when exception locking fails", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, triggerLockedById: null })
    mockedLockException.mockResolvedValue(Error("Dummy error 1"))

    const result = await lockAndAuditLog(testDatabaseGateway.writable, auditLogDynamoGateway, user, caseObj.errorId)

    expect((result as Error).message).toBe("Dummy error 1")
  })

  it("returns an error when trigger locking fails", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, triggerLockedById: null })
    mockedLockTrigger.mockResolvedValue(Error("Dummy error 2"))

    const result = await lockAndAuditLog(testDatabaseGateway.writable, auditLogDynamoGateway, user, caseObj.errorId)

    expect((result as Error).message).toBe("Dummy error 2")
  })

  it("returns an error when audit logging fails", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null, triggerLockedById: null })
    mockedCreateAuditLogEvents.mockResolvedValue(Error("Dummy error 3"))

    const result = await lockAndAuditLog(testDatabaseGateway.writable, auditLogDynamoGateway, user, caseObj.errorId)

    expect((result as Error).message).toBe("Dummy error 3")
  })
})
