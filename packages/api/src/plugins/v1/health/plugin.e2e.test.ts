import type { FastifyInstance } from "fastify"

import { OK } from "http-status"

import { V1 } from "../../../endpoints/versionedEndpoints"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"

describe("health plugin", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /health should return Ok using the HealthRoutes enum", async () => {
    const response = await fetch(`${helper.address}${V1.Health}`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })

  it("GET /health should return Ok using the a string as the route", async () => {
    const response = await fetch(`${helper.address}/v1/health`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })
})
