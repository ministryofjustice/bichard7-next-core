import type { FastifyInstance } from "fastify"
import build from "../../app"

describe("health plugin", () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /health should return Ok", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health"
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("Ok")
  })
})
