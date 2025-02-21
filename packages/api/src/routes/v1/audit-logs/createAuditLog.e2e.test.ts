import type { AxiosRequestConfig } from "axios"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import axios, { HttpStatusCode } from "axios"

import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../tests/helpers/jwtHelper"
import { mockInputApiAuditLog } from "../../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const jwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const axiosOptions: AxiosRequestConfig = { headers: { Authorization: `Bearer ${jwt}` }, validateStatus: () => true }

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

    const result = await axios.post(`${helper.address}${endpoint}`, auditLog, axiosOptions)
    expect(result.status).toEqual(HttpStatusCode.Created)

    const record = await gateway.getOne(auditLogDynamoConfig.auditLogTableName, "messageId", auditLog.messageId)
    if (isError(record)) {
      throw record
    }

    expect(record?.Item?.messageId).toEqual(auditLog.messageId)
  })

  it("should return a conflict error if the message id already exists", async () => {
    const auditLog = mockInputApiAuditLog()

    const result1 = await axios.post(`${helper.address}${endpoint}`, auditLog, axiosOptions)
    expect(result1.status).toEqual(HttpStatusCode.Created)

    const result2 = await axios.post(`${helper.address}${endpoint}`, auditLog, axiosOptions)
    expect(result2.status).toEqual(HttpStatusCode.Conflict)
    expect(result2.data).toStrictEqual({
      code: "Conflict",
      message: `A message with Id ${auditLog.messageId} already exists in the database`,
      statusCode: 409
    })
  })
})
