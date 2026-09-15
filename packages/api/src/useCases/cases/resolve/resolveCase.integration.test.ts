import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { FastifyBaseLogger } from "fastify"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import insertNote from "../../../services/db/cases/insertNote"
import selectMessageId from "../../../services/db/cases/selectMessageId"
import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import createAuditLogEvents from "../../createAuditLogEvents"
import { unlockAndAuditLog } from "../getCase/unlockAndAuditLog"
import { resolveCase } from "./resolveCase"
import { resolveError } from "./resolveError"

jest.mock("../../../services/db/cases/insertNote")
jest.mock("../../../services/db/cases/selectMessageId")
jest.mock("../../createAuditLogEvents")
jest.mock("../getCase/unlockAndAuditLog")
jest.mock("./resolveError")

const mockResolveError = resolveError as jest.MockedFunction<typeof resolveError>
const mockInsertNote = insertNote as jest.MockedFunction<typeof insertNote>
const mockSelectMessageId = selectMessageId as jest.MockedFunction<typeof selectMessageId>
const mockCreateAuditLogEvents = createAuditLogEvents as jest.MockedFunction<typeof createAuditLogEvents>
const mockUnlockAndAuditLog = unlockAndAuditLog as jest.MockedFunction<typeof unlockAndAuditLog>

const mockLogger = {
  error: jest.fn(),
  info: jest.fn()
} as unknown as FastifyBaseLogger

describe("resolveCase orchestration integration", () => {
  let databaseGateway: End2EndPostgres
  const mockAuditLogDynamoGateway = {} as AuditLogDynamoGateway

  beforeAll(() => {
    databaseGateway = new End2EndPostgres()
  })

  beforeEach(async () => {
    await databaseGateway.clearDb()

    jest.clearAllMocks()

    mockResolveError.mockImplementation(async (tx, _user, caseId, _resolution, auditLogEvents) => {
      await tx.connection`
        UPDATE br7own.error_list 
        SET error_status = ${ResolutionStatusNumber.Resolved} 
        WHERE error_id = ${caseId}
      `
      auditLogEvents.push({} as ApiAuditLogEvent)
      return undefined
    })

    mockUnlockAndAuditLog.mockResolvedValue(undefined)
    mockInsertNote.mockResolvedValue(true)
    mockSelectMessageId.mockResolvedValue("mock-message-id")
    mockCreateAuditLogEvents.mockResolvedValue(undefined)
  })

  afterAll(async () => {
    await databaseGateway.close()
  })

  it("successfully calls resolveError, unlockAndAuditLog, insertNote, and createAuditLogEvents", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved,
      triggerLockedById: user.username
    })

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(result).toBeUndefined()

    expect(mockResolveError).toHaveBeenCalledTimes(1)

    expect(mockUnlockAndAuditLog).toHaveBeenCalledTimes(1)
    expect(mockUnlockAndAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      user,
      caseObj.errorId,
      2,
      expect.any(Array),
      user.username,
      user.username
    )

    expect(mockInsertNote).toHaveBeenCalledTimes(1)
    expect(mockInsertNote).toHaveBeenCalledWith(
      expect.anything(),
      caseObj.errorId,
      `${user.username}: Portal Action: Record Manually Resolved. Reason: UpdatedDisposal. Reason Text: Test reason text`,
      "System"
    )

    expect(mockSelectMessageId).toHaveBeenCalledWith(expect.anything(), user, caseObj.errorId)
    expect(mockCreateAuditLogEvents).toHaveBeenCalledWith(
      expect.any(Array),
      "mock-message-id",
      mockAuditLogDynamoGateway,
      mockLogger
    )
  })

  it("rolls back database transaction and halts execution if unlockAndAuditLog fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockUnlockAndAuditLog.mockResolvedValueOnce(new Error("Unlock error"))

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )
    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Unlock error")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockInsertNote).not.toHaveBeenCalled()
    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction and halts execution if resolveError fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockResolveError.mockResolvedValueOnce(new Error("General resolve error"))

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("General resolve error")

    expect(mockUnlockAndAuditLog).not.toHaveBeenCalled()
    expect(mockInsertNote).not.toHaveBeenCalled()
    expect(mockSelectMessageId).not.toHaveBeenCalled()
    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction and halts execution if insertNote fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockInsertNote.mockResolvedValueOnce(new Error("General insert note error"))

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("General insert note error")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()

    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction and halts execution if selectMessageId fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockSelectMessageId.mockResolvedValueOnce(new Error("General selectMessageId error"))

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("General selectMessageId error")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()
    expect(mockInsertNote).toHaveBeenCalled()

    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction if createAuditLogEvents fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockCreateAuditLogEvents.mockResolvedValueOnce(new Error("DynamoDB write failed"))

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("DynamoDB write failed")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()
    expect(mockInsertNote).toHaveBeenCalled()
  })

  it("skips audit log creation if auditLogEvents is empty", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockResolveError.mockImplementation(async (_tx, _user, _caseId, _resolution) => {
      return undefined
    })

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(result).toBeUndefined()

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()
    expect(mockInsertNote).toHaveBeenCalled()

    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
    expect(mockSelectMessageId).not.toHaveBeenCalled()
    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("returns an error if fetchCase fails because case doesn't exist", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    const auditLogEvents: ApiAuditLogEvent[] = []

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      999,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Case id 999 for user User1 not found")
    expect(auditLogEvents).toHaveLength(0)
  })

  it("returns an error if exceptions are locked to another user", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: "another_user",
      errorStatus: ResolutionStatusNumber.Unresolved
    })
    const auditLogEvents: ApiAuditLogEvent[] = []

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      1,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Case id 1 is locked to another user")
    expect(auditLogEvents).toHaveLength(0)
  })

  it("exits early if user does not have exceptions handler permissions", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.TriggerHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      databaseGateway.writable,
      user,
      caseObj.errorId,
      validResolution,
      mockAuditLogDynamoGateway,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotAllowedError)
  })
})
