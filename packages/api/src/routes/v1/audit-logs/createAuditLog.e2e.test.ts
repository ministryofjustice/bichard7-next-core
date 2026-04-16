import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../tests/helpers/jwtHelper"
import { mockInputApiAuditLog } from "../../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const jwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const fetchOptions: RequestInit = { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" } }

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<{ data: T; status: number }> => {
  const response = await fetch(url, { ...fetchOptions, ...init })
  const data = (await response.json()) as T
  return { data, status: response.status }
}

describe("Creating Audit Log", () => {
  const endpoint = V1.AuditLogs
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.dynamo.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("should create a new audit log record", async () => {
    const gateway = new TestDynamoGateway(auditLogDynamoConfig)

    const auditLog = mockInputApiAuditLog()

    const result = await fetchJson(`${helper.address}${endpoint}`, {
      body: JSON.stringify(auditLog),
      method: "POST"
    })
    expect(result.status).toBe(201)

    const record = await gateway.getOne(auditLogDynamoConfig.auditLogTableName, "messageId", auditLog.messageId)
    if (isError(record)) {
      throw record
    }

    expect(record?.Item?.messageId).toEqual(auditLog.messageId)
  })

  it("should return a conflict error if the message id already exists", async () => {
    const auditLog = mockInputApiAuditLog()

    const result1 = await fetchJson(`${helper.address}${endpoint}`, {
      body: JSON.stringify(auditLog),
      method: "POST"
    })
    expect(result1.status).toBe(201)

    const result2 = await fetchJson(`${helper.address}${endpoint}`, {
      body: JSON.stringify(auditLog),
      method: "POST"
    })
    expect(result2.status).toBe(409)
    expect(result2.data).toEqual({
      code: "Conflict",
      message: `A message with Id ${auditLog.messageId} already exists in the database`,
      statusCode: 409
    })
  })
})
