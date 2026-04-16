import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../tests/helpers/userHelper"

describe("/v1/connectivity e2e", () => {
  const endpoint = V1.Connectivity
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

  it("will return the true values for dependencies", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual({
      conductor: true,
      database: true
    })
  })

  it("will still work if no user logged in", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, {
      method: "GET"
    })

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual({
      conductor: true,
      database: true
    })
  })
})
