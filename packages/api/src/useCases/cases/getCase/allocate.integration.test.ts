import type { AllocationBody } from "@moj-bichard7/common/contracts/AllocationBody"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { NotFoundError } from "../../../types/errors/NotFoundError"
import allocate from "./allocate"

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
} as unknown as FastifyBaseLogger

describe("allocate integration", () => {
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns NotAllowedError if the executing user lacks permissions", async () => {
    const executingUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Audit],
      visibleForces: ["01"]
    })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null })

    const query: AllocationBody = {
      allocatedToUserId: 999,
      caseType: "exceptions"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      executingUser,
      mockLogger,
      query,
      caseObj.errorId
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotAllowedError)
  })

  it("returns an error if the user being allocated to does not exist in the database", async () => {
    const supervisorUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor, UserGroup.Allocator],
      visibleForces: ["01"]
    })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null })

    const query: AllocationBody = {
      allocatedToUserId: 99999,
      caseType: "exceptions"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      supervisorUser,
      mockLogger,
      query,
      caseObj.errorId
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotFoundError)
    expect(mockLogger.error).toHaveBeenCalled()
  })

  it("returns an error if the target user exists but is has no visible forces in common with the executing user", async () => {
    const supervisorUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor, UserGroup.Allocator],
      visibleForces: ["01"]
    })

    const targetUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["02"]
    })

    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: null })

    const query: AllocationBody = {
      allocatedToUserId: targetUser.id,
      caseType: "exceptions"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      supervisorUser,
      mockLogger,
      query,
      caseObj.errorId
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotFoundError)
    expect(mockLogger.error).toHaveBeenCalled()
  })

  it("successfully allocates exceptions to target user", async () => {
    const supervisorUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor, UserGroup.Allocator],
      username: "allocating_supervisor",
      visibleForces: ["01"]
    })

    const targetUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      username: "allocated_handler",
      visibleForces: ["01"]
    })

    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: null,
      triggerLockedById: null
    })

    const query: AllocationBody = {
      allocatedToUserId: targetUser.id,
      caseType: "exceptions"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      supervisorUser,
      mockLogger,
      query,
      caseObj.errorId
    )

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`

    expect(updatedCase[0].error_locked_by_id).toBe(targetUser.username)
    expect(updatedCase[0].trigger_locked_by_id).toBeNull()
  })

  it("successfully allocates triggers to target user", async () => {
    const supervisorUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor, UserGroup.Allocator],
      username: "allocating_supervisor",
      visibleForces: ["01"]
    })

    const targetUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      username: "allocated_handler",
      visibleForces: ["01"]
    })

    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: null,
      triggerLockedById: null
    })

    const query: AllocationBody = {
      allocatedToUserId: targetUser.id,
      caseType: "triggers"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      supervisorUser,
      mockLogger,
      query,
      caseObj.errorId
    )

    expect(isError(result)).toBe(false)

    const updatedCase = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`

    expect(updatedCase[0].trigger_locked_by_id).toBe(targetUser.username)
    expect(updatedCase[0].error_locked_by_id).toBeNull()
  })

  it("returns an error and logs it if lockAndAuditLog execution fails", async () => {
    const supervisorUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor, UserGroup.Allocator],
      visibleForces: ["01"]
    })

    const targetUser = await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["01"]
    })

    const query: AllocationBody = {
      allocatedToUserId: targetUser.id,
      caseType: "exceptions"
    }

    const result = await allocate(
      auditLogGateway,
      testDatabaseGateway.writable,
      supervisorUser,
      mockLogger,
      query,
      99999
    )

    expect(isError(result)).toBe(true)
    expect(mockLogger.error).toHaveBeenCalled()
  })
})
