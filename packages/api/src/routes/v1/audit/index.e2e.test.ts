import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, format, subDays, subWeeks } from "date-fns"
import { BAD_REQUEST, CREATED, FORBIDDEN } from "http-status"

import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"

describe("POST /v1/audit", () => {
  const endpoint = V1.Audit
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("returns 201 CREATED when audit created successfully", async () => {
    const testUsername = "user1"
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])
    const cases = await Promise.all([
      createCase(helper.postgres, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(helper.postgres, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])

    const payload = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      resolvedByUsers: [testUsername],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 50
    } satisfies CreateAuditInput
    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(CREATED)
    const body = (await response.json()) as unknown as AuditDto
    expect(body.auditId).toBeGreaterThan(0)
    expect(body.fromDate).toBe(payload.fromDate)
    expect(body.toDate).toBe(payload.toDate)
    expect(body.createdBy).toBe(user.username)

    const auditCases = await helper.postgres.getAuditCases(body.auditId)
    expect(auditCases).toHaveLength(1) // 50% of 2 courses
    expect(auditCases).toEqual([
      { audit_case_id: expect.any(Number), audit_id: body.auditId, error_id: cases[0].errorId }
    ])
  })

  it("returns 400 Bad Request when date range is in the past", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify({
        fromDate: format(new Date(), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate: format(addDays(new Date(), 1), "yyyy-MM-dd"), // Date ranges in the future should be rejected
        volumeOfCases: 20
      } satisfies CreateAuditInput),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(BAD_REQUEST)

    const responseText = await response.text()
    expect(responseText).toContain("Date range cannot be in the future")
  })

  it("returns 400 Bad Request when no included types", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify({
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: [],
        resolvedByUsers: ["user1"],
        toDate: format(new Date(), "yyyy-MM-dd"), // Date ranges in the future should be rejected
        volumeOfCases: 20
      } satisfies CreateAuditInput),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(BAD_REQUEST)

    const responseText = await response.text()
    expect(responseText).toContain("includedTypes")
  })

  it("returns 400 Bad Request when no users", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify({
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: [],
        resolvedByUsers: [],
        toDate: format(new Date(), "yyyy-MM-dd"), // Date ranges in the future should be rejected
        volumeOfCases: 20
      } satisfies CreateAuditInput),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(BAD_REQUEST)

    const responseText = await response.text()
    expect(responseText).toContain("resolvedByUsers")
  })

  it("returns 403 when user does not have permission to do audits", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])

    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify({
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate: format(new Date(), "yyyy-MM-dd"),
        volumeOfCases: 20
      } satisfies CreateAuditInput),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(FORBIDDEN)
  })
})
