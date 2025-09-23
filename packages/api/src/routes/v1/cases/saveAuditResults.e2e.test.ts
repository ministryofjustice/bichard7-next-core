import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_REQUEST, OK, UNPROCESSABLE_ENTITY } from "http-status"

import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    body: JSON.stringify({ errorQuality: 1, triggerQuality: 2 }),
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "POST"
  }
}

describe("/V1/cases/:caseId/audit", () => {
  const endpoint = V1.CaseAudit
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

  it("receives 200 OK when audit quality saved successfully", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
  })

  it("received 400 Bad Request when request body is invalid", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)
    const invalidRequest = {
      body: JSON.stringify({}),
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST"
    }

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, invalidRequest)

    expect(response.status).toBe(BAD_REQUEST)
  })

  it("receives 422 Unprocessable Entity when there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "2")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(UNPROCESSABLE_ENTITY)
  })
})
