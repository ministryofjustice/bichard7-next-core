import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import build from "../../app"
import HealthRoutes from "./routes"

describe("health plugin", () => {
  const port = 8888
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
    app.listen({ port })
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /health should return Ok using the HealthRoutes enum", async () => {
    const response = await fetch(`http://localhost:${port}${HealthRoutes.HEALTH}`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })

  it("GET /health should return Ok using the a string as the route", async () => {
    const response = await fetch(`http://localhost:${port}/health`)

    expect(response.status).toBe(OK)
    expect(await response.text()).toBe("Ok")
  })
})
