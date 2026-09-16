import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { auditLogEventLookup as AuditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { FORBIDDEN, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"

import type { OutputApiAuditLog } from "../../../../../types/AuditLog"

import fetchCase from "../../../../../services/db/cases/fetchCase"
import { createCase } from "../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../../../tests/helpers/userHelper"
import FetchById from "../../../../../useCases/fetchAuditLogs/FetchById"

const defaultRequest = (
  jwt: string,
  body: Record<string, unknown> = {
    reason: "UpdatedDisposal",
    reasonText: "Test comment"
  }
) => {
  return {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  }
}

describe("/v1/cases/:caseId/exceptions/resolve e2e", () => {
  const endpoint = V1.CaseExceptionsResolve
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will receive a 404 error if there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "999")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("will receive a 404 error if there's a case found and not with the user's force", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler], {
      visibleCourts: [],
      visibleForces: ["01"]
    })
    await createCase(helper.postgres, {
      errorLockedById: user.username,
      orgForPoliceFilter: "02"
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("will receive 403 Forbidden if there's a case found but the user doesn't trigger and exception permissions", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.TriggerHandler])
    await createCase(helper.postgres, { errorLockedById: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive 422 unprocessable error if there's a case found but it's locked to another user", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres, { errorLockedById: "another_user" })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(UNPROCESSABLE_ENTITY)
  })

  it("will receive 404 NotFound error if the case exists but it's already resolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Resolved,
      resolutionAt: new Date()
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("will receive 200 OK if there's a case found and the case is successfully resolved by the user", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    const caseObj = await createCase(helper.postgres, {
      errorCount: 1,
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved,
      triggerLockedById: user.username
    })

    const response = await fetch(
      `${helper.address}${endpoint.replace(":caseId", String(caseObj.errorId))}`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(OK)

    const updatedCase = await fetchCase(helper.postgres.readonly, user, caseObj.errorId, app.log)
    if (!("errorStatus" in updatedCase)) {
      throw updatedCase
    }

    expect(updatedCase.errorStatus).toBe("Resolved")
    expect(updatedCase.errorLockedByUsername).toBeNull()
    expect(updatedCase.triggerLockedByUsername).toBeNull()

    const notes = await helper.postgres.writable.connection`
      SELECT note_text, user_id FROM br7own.error_list_notes WHERE error_id = ${caseObj.errorId}
    `
    expect(notes).toHaveLength(1)
    expect(notes[0].user_id).toBe("System")
    expect(notes[0].note_text).toContain("Portal Action: Record Manually Resolved.")

    const auditLogJson = await new FetchById(helper.dynamo, caseObj.messageId).fetch()
    expect(auditLogJson).toBeDefined()

    const auditLogObj = auditLogJson as OutputApiAuditLog
    const resolvedEvent = auditLogObj.events!.find((e) => e.eventCode === EventCode.ExceptionsResolved)
    const unlockExceptionsEvent = auditLogObj.events!.find((e) => e.eventCode === EventCode.ExceptionsUnlocked)
    const unlockTriggersEvent = auditLogObj.events!.find((e) => e.eventCode === EventCode.TriggersUnlocked)

    expect(resolvedEvent).toHaveProperty("category", EventCategory.information)
    expect(resolvedEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.ExceptionsResolved])
    expect(resolvedEvent).toHaveProperty("user", user.username)

    expect(unlockExceptionsEvent).toBeDefined()
    expect(unlockTriggersEvent).toBeDefined()
  })
})
