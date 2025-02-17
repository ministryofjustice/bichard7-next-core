import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK, UNAUTHORIZED } from "http-status"

import { generateTestJwtToken } from "../../tests/helpers/jwtHelper"
import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../tests/helpers/userHelper"

const defaultsHeaders = { Authorization: "Bearer " }

describe("authentication e2e", () => {
  const endpoint = V1.Me
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

  it("will return with no headers 401 - Unauthorized", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, { headers: {} })

    expect(response.status).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt doesn't start with Bearer", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { ...defaultsHeaders, Authorization: "Not Bearer " }
    })

    expect(response.status).toBe(UNAUTHORIZED)
  })

  it("returns 401 Unauthorized with a missing user", async () => {
    await createUserAndJwtToken(helper.postgres)
    const [encodedJwt] = generateTestJwtToken({ email: "unknownuser@exmaple.com", username: "UnknownUser" })

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { ...defaultsHeaders, Authorization: `Bearer ${encodedJwt}` }
    })

    expect(response.status).toBe(UNAUTHORIZED)
  })

  it("returns 200 if the verification result is a User", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { ...defaultsHeaders, Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
  })
})
