import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK } from "http-status"

import build from "../../../app"
import FakeDataStore from "../../../services/gateways/dataStoreGateways/fakeDataStore"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../../services/gateways/dynamo/createAuditLogDynamoDbConfig"

describe("health plugin", () => {
  const fakeDataStore = new FakeDataStore()
  let app: FastifyInstance
  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, dataStore: fakeDataStore })
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("GET /v1/health should return Ok using the HealthRoutes enum", async () => {
    const response = await app.inject({ method: "GET", url: V1.Health })

    expect(response.statusCode).toBe(OK)
    expect(response.body).toBe("Ok")
  })

  it("GET /v1/health should return Ok using the a string as the route", async () => {
    const response = await app.inject({ method: "GET", url: "/v1/health" })

    expect(response.statusCode).toBe(OK)
    expect(response.body).toBe("Ok")
  })
})
