import type { FastifyInstance } from "fastify"
import build from "../../../src/app"
import HealthRoutes from "../../../src/plugins/health/routes"

describe("health plugin", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /health should return Ok using the HealthRoutes enum", async () => {
    const response = await app.inject({
      method: "GET",
      url: HealthRoutes.HEALTH
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("Ok")
  })

  it("GET /health should return Ok using the a string as the route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health"
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("Ok")
  })
})
