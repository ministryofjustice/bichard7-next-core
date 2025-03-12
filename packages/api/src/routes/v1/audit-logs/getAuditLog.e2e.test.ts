jest.setTimeout(999999)
import type { AxiosRequestConfig } from "axios"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import axios, { HttpStatusCode } from "axios"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import addQueryParams from "../../../tests/helpers/addQueryParams"
import { createMockAuditLog } from "../../../tests/helpers/createMockAuditLogs"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../tests/helpers/jwtHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)

const jwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const axiosOptions: AxiosRequestConfig = { headers: { Authorization: `Bearer ${jwt}` }, validateStatus: () => true }

let url: string

describe("Getting a single Audit Log", () => {
  const endpoint = V1.AuditLog
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    url = `${helper.address}${endpoint}`
  })

  beforeEach(async () => {
    await helper.dynamo.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  beforeEach(async () => {
    await testDynamoGateway.deleteAll(auditLogDynamoConfig.auditLogTableName, "messageId")
    await testDynamoGateway.deleteAll(auditLogDynamoConfig.eventsTableName, "_id")
  })

  it("should return a specific audit log record", async () => {
    const auditLog = await createMockAuditLog()
    if (isError(auditLog)) {
      throw new Error("Unexpected error")
    }

    const result = await axios.get<OutputApiAuditLog[]>(url.replace(":correlationId", auditLog.messageId), axiosOptions)
    expect(result.status).toEqual(HttpStatusCode.Ok)

    expect(result.data).toHaveProperty("messageId", auditLog.messageId)
  })

  it("should return 404 status code and empty array", async () => {
    const result = await axios.get(url.replace(":correlationId", "dummyId"), axiosOptions)
    expect(result).toBeDefined()
    expect(result.status).toEqual(HttpStatusCode.NotFound)
    expect(result.data).toHaveProperty("message", "A message with Id dummyId does not exist in the database")
  })

  describe("including and excluding columns", () => {
    it("should not show excluded columns", async () => {
      const auditLog = await createMockAuditLog()
      if (isError(auditLog)) {
        throw auditLog
      }

      const defaultResult = await axios.get<OutputApiAuditLog[]>(
        url.replace(":correlationId", auditLog.messageId),
        axiosOptions
      )
      expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
      expect(defaultResult.data).toHaveProperty("events")
      expect(defaultResult.data).toHaveProperty("receivedDate")
      const defaultKeys = Object.keys(defaultResult.data)

      const excludedResult = await axios.get<OutputApiAuditLog[]>(
        addQueryParams(url.replace(":correlationId", auditLog.messageId), { excludeColumns: "receivedDate,events" }),
        axiosOptions
      )

      expect(excludedResult.status).toEqual(HttpStatusCode.Ok)
      expect(excludedResult.data).not.toHaveProperty("events")
      expect(excludedResult.data).not.toHaveProperty("receivedDate")
      expect(Object.keys(excludedResult.data)).toHaveLength(defaultKeys.length - 2)
    })

    it("should show included columns", async () => {
      const auditLog = await createMockAuditLog()
      if (isError(auditLog)) {
        throw new Error("Unexpected error")
      }

      const defaultResult = await axios.get<OutputApiAuditLog[]>(
        url.replace(":correlationId", auditLog.messageId),
        axiosOptions
      )
      expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
      expect(defaultResult.data).not.toHaveProperty("messageHash")

      const includedResult = await axios.get<OutputApiAuditLog[]>(
        addQueryParams(url.replace(":correlationId", auditLog.messageId), { includeColumns: "messageHash" }),
        axiosOptions
      )

      expect(includedResult.status).toEqual(HttpStatusCode.Ok)
      expect(includedResult.data).toHaveProperty("messageHash")
    })

    it("should work with excluded and included columns", async () => {
      const auditLog = await createMockAuditLog()
      if (isError(auditLog)) {
        throw new Error("Unexpected error")
      }

      const defaultResult = await axios.get<OutputApiAuditLog[]>(
        url.replace(":correlationId", auditLog.messageId),
        axiosOptions
      )
      expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
      expect(defaultResult.data).not.toHaveProperty("messageHash")
      expect(defaultResult.data).toHaveProperty("events")
      expect(defaultResult.data).toHaveProperty("receivedDate")

      const filteredResult = await axios.get<OutputApiAuditLog[]>(
        addQueryParams(url.replace(":correlationId", auditLog.messageId), {
          excludeColumns: "receivedDate,events",
          includeColumns: "messageHash"
        }),
        axiosOptions
      )

      expect(filteredResult.status).toEqual(HttpStatusCode.Ok)
      expect(filteredResult.data).toHaveProperty("messageHash")
      expect(filteredResult.data).not.toHaveProperty("events")
      expect(filteredResult.data).not.toHaveProperty("receivedDate")
    })
  })
})
