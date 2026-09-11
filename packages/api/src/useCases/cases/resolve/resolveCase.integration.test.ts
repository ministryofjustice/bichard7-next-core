import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { FastifyBaseLogger } from "fastify"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import insertNote from "../../../services/db/cases/insertNote"
import selectMessageId from "../../../services/db/cases/selectMessageId"
import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../tests/helpers/userHelper"
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
  let helper: SetupAppEnd2EndHelper

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    jest.clearAllMocks()

    mockResolveError.mockImplementation(async (_tx, _user, _caseId, _resolution, auditLogEvents) => {
      auditLogEvents.push({} as ApiAuditLogEvent)
      return undefined
    })

    mockUnlockAndAuditLog.mockResolvedValue(undefined)
    mockInsertNote.mockResolvedValue(true)
    mockSelectMessageId.mockResolvedValue("mock-message-id")
    mockCreateAuditLogEvents.mockResolvedValue(undefined)
  })

  afterAll(async () => {
    await helper.postgres.close()
  })

  it("successfully calls resolveError, unlockAndAuditLog, insertNote, and createAuditLogEvents", async () => {
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
      mockLogger
    )

    expect(result).toBeUndefined()

    expect(mockResolveError).toHaveBeenCalledTimes(1)

    expect(mockUnlockAndAuditLog).toHaveBeenCalledTimes(1)
    expect(mockUnlockAndAuditLog).toHaveBeenCalledWith(expect.anything(), user, caseObj.errorId, 2, expect.any(Array))

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
      helper.dynamo,
      mockLogger
    )
  })

  it("rolls back database transaction and halts execution if unlockAndAuditLog fails", async () => {
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
      mockLogger
    )
    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Unlock error")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockInsertNote).not.toHaveBeenCalled()
    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction and halts execution if resolveError fails", async () => {
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
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
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("General insert note error")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()

    expect(mockCreateAuditLogEvents).not.toHaveBeenCalled()
  })

  it("rolls back database transaction and halts execution if selectMessageId fails", async () => {
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
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
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
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
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
      mockLogger
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("DynamoDB write failed")

    expect(mockResolveError).toHaveBeenCalled()
    expect(mockUnlockAndAuditLog).toHaveBeenCalled()
    expect(mockInsertNote).toHaveBeenCalled()
  })

  it("skips audit log creation if auditLogEvents is empty", async () => {
    const user = await createUser(helper.postgres, { groups: [UserGroup.GeneralHandler], id: 1 })
    const caseObj = await createCase(helper.postgres, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    mockResolveError.mockImplementation(async (_tx, _user, _caseId, _resolution, auditLogEvents) => {
      auditLogEvents = []
      return undefined
    })
    mockUnlockAndAuditLog.mockImplementationOnce(async () => undefined)

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }

    const result = await resolveCase(
      helper.postgres.writable,
      user,
      caseObj.errorId,
      validResolution,
      helper.dynamo,
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
})
