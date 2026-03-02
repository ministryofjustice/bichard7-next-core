import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { format, subWeeks } from "date-fns"
import { CREATED } from "http-status"

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
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const response = await fetch(`${helper.address}${endpoint}`, {
      body: JSON.stringify({
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate: format(new Date(), "yyyy-MM-dd"),
        volumeOfCases: 50
      } satisfies CreateAuditInput),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    })

    expect(response.status).toBe(CREATED)
    const body = (await response.json()) as unknown as AuditDto
    expect(body.auditId).toBeGreaterThan(0)
  })
})
