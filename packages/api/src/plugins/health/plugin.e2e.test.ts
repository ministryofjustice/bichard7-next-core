import type { FastifyInstance } from "fastify"

import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import HealthRoutes from "./routes"

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
    const response = await fetch(`${helper.address}${HealthRoutes.HEALTH}`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })

  it("GET /health should return Ok using the a string as the route", async () => {
    const response = await fetch(`${helper.address}/health`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })
})
