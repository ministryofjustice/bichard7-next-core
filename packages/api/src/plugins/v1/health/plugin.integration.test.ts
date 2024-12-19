import type { FastifyInstance } from "fastify"

import { OK } from "http-status"

import build from "../../../app"
import { VersionedEndpoints } from "../../../endpoints/versionedEndpoints"
import FakeDataStore from "../../../services/gateways/dataStoreGateways/fakeDataStore"

describe("health plugin", () => {
  const db = new FakeDataStore()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build({ db })
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /v1/health should return Ok using the HealthRoutes enum", async () => {
    const response = await app.inject({
      method: "GET",
      url: VersionedEndpoints.V1Health
    })

    expect(response.statusCode).toBe(OK)
    expect(response.body).toBe("Ok")
  })

  it("GET /v1/health should return Ok using the a string as the route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/health"
    })

    expect(response.statusCode).toBe(OK)
    expect(response.body).toBe("Ok")
  })
})
