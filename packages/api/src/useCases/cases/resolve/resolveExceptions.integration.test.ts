import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionReasonCode } from "@moj-bichard7/common/types/ManualResolution"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { resolveExceptions } from "./resolveExceptions"

describe("resolveExceptions integration", () => {
  let databaseGateway: End2EndPostgres

  beforeAll(() => {
    databaseGateway = new End2EndPostgres()
  })

  beforeEach(async () => {
    await databaseGateway.clearDb()
  })

  afterAll(async () => {
    await databaseGateway.close()
  })

  it("returns an error if validateManualResolution fails", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    const auditLogEvents: ApiAuditLogEvent[] = []

    const invalidResolution: ResolveBody = {
      reason: "Reallocated",
      reasonText: "",
      resolutionStatus: "Resolved"
    }

    const result = await databaseGateway.writable.transaction((tx) =>
      resolveExceptions(tx, user, 1, invalidResolution, auditLogEvents)
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Reason text is required")
    expect(auditLogEvents).toHaveLength(0)
  })

  it("returns if exception is already resolved", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    await createCase(databaseGateway, {
      errorCount: 1,
      errorResolvedBy: user.username,
      errorStatus: ResolutionStatusNumber.Resolved
    })
    const auditLogEvents: ApiAuditLogEvent[] = []

    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test reason text",
      resolutionStatus: "Resolved"
    }
    const result = await databaseGateway.writable.transaction((tx) =>
      resolveExceptions(tx, user, 1, validResolution, auditLogEvents)
    )

    expect(isError(result)).toBe(true)
    expect(auditLogEvents).toHaveLength(0)
  })

  it("resolves exceptions and populates resolution_ts when all triggers resolved", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    await createTriggers(databaseGateway, caseObj.errorId, [{ status: ResolutionStatusNumber.Resolved }])

    const auditLogEvents: ApiAuditLogEvent[] = []
    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test comment",
      resolutionStatus: "Resolved"
    }

    const result = await databaseGateway.writable.transaction((tx) =>
      resolveExceptions(tx, user, caseObj.errorId, validResolution, auditLogEvents)
    )

    expect(result).toBeUndefined()

    const [updatedCase] = await databaseGateway.writable.connection`
      SELECT error_status, error_resolved_by, error_resolved_ts, resolution_ts 
      FROM br7own.error_list 
      WHERE error_id = ${caseObj.errorId}
    `

    expect(updatedCase.error_status).toBe(ResolutionStatusNumber.Resolved)
    expect(updatedCase.error_resolved_by).toBe(user.username)
    expect(updatedCase.error_resolved_ts).toBeDefined()
    expect(updatedCase.resolution_ts).toBeDefined()
    expect(updatedCase.resolution_ts).toEqual(updatedCase.error_resolved_ts)

    expect(auditLogEvents).toHaveLength(1)
    expect(auditLogEvents[0].eventCode).toBe(EventCode.ExceptionsResolved)
    expect(auditLogEvents[0].attributes).toMatchObject({
      resolutionReasonCode: ResolutionReasonCode["UpdatedDisposal"],
      resolutionReasonText: "Test comment",
      user: user.username
    })
  })

  it("resolves the error but does not populate resolution_ts if there are unresolved triggers", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })
    await createTriggers(databaseGateway, caseObj.errorId, [{ status: ResolutionStatusNumber.Unresolved }])

    const auditLogEvents: ApiAuditLogEvent[] = []
    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test comment",
      resolutionStatus: "Resolved"
    }

    const result = await databaseGateway.writable.transaction((tx) =>
      resolveExceptions(tx, user, caseObj.errorId, validResolution, auditLogEvents)
    )

    expect(result).toBeUndefined()

    const [updatedCase] = await databaseGateway.writable.connection`
      SELECT error_status, error_resolved_by, error_resolved_ts, resolution_ts 
      FROM br7own.error_list 
      WHERE error_id = ${caseObj.errorId}
    `

    expect(updatedCase.error_status).toBe(ResolutionStatusNumber.Resolved)
    expect(updatedCase.error_resolved_by).toBe(user.username)
    expect(updatedCase.error_resolved_ts).toBeDefined()
    expect(updatedCase.resolution_ts).toBeNull()

    expect(auditLogEvents).toHaveLength(1)
    expect(auditLogEvents[0].eventCode).toBe(EventCode.ExceptionsResolved)
    expect(auditLogEvents[0].attributes).toMatchObject({
      resolutionReasonCode: ResolutionReasonCode["UpdatedDisposal"],
      resolutionReasonText: "Test comment",
      user: user.username
    })
  })

  it("returns an unprocessable error if the update fails because the case is locked by another user", async () => {
    const user = await createUser(databaseGateway, { groups: [UserGroup.ExceptionHandler], id: 1 })
    const caseObj = await createCase(databaseGateway, {
      errorCount: 1,
      errorLockedById: "another_user",
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    const auditLogEvents: ApiAuditLogEvent[] = []
    const validResolution: ResolveBody = {
      reason: "UpdatedDisposal",
      reasonText: "Test comment",
      resolutionStatus: "Resolved"
    }

    const result = await databaseGateway.writable.transaction((tx) =>
      resolveExceptions(tx, user, caseObj.errorId, validResolution, auditLogEvents)
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toContain(`Couldn't resolve case id: ${caseObj.errorId}`)
    expect(auditLogEvents).toHaveLength(0)
  })
})
