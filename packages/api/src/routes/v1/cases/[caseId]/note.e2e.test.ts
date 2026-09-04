import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_REQUEST, CREATED, NOT_FOUND } from "http-status"

import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string, body: Record<string, unknown> = { noteText: "This is a note" }) => ({
  body: JSON.stringify(body),
  headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
  method: "POST"
})

describe("/V1/cases/:caseId/note e2e tests", () => {
  const endpoint = V1.Note
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

  it("receives 201 CREATED when note saved successfully", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(CREATED)
  })

  it("received 400 Bad Request when request body is invalid", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)
    const invalidRequest = defaultRequest(encodedJwt, {})

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, invalidRequest)

    expect(response.status).toBe(BAD_REQUEST)
  })

  it("receives 404 Not Found when there is no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "2")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("returns 404 Not Found if the user has no visible courts or visible forces in common with the case", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler], {
      visibleCourts: ["DEF"],
      visibleForces: ["02"]
    })
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })
})
