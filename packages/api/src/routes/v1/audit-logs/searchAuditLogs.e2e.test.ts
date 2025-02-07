import type { AxiosRequestConfig } from "axios"
import type { FastifyInstance } from "fastify"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import axios, { HttpStatusCode } from "axios"

import type { DynamoAuditLog, OutputApiAuditLog } from "../../../types/AuditLog"

import { V1 } from "../../../endpoints/versionedEndpoints"
import addQueryParams from "../../../tests/helpers/addQueryParams"
import {
  createMockAuditLog,
  createMockAuditLogEvent,
  createMockAuditLogs,
  createMockError
} from "../../../tests/helpers/createMockAuditLogs"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../tests/helpers/jwtHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)

const jwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const axiosOptions: AxiosRequestConfig = {
  headers: { Authorization: `Bearer ${jwt}` },
  validateStatus: () => true
}

let url: string

describe("Getting Audit Logs", () => {
  const endpoint = V1.AuditLogs
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

  it("should return the audit log records", async () => {
    const auditLog = await createMockAuditLog()
    if (isError(auditLog)) {
      throw new Error("Unexpected error")
    }

    const result2 = await axios.get<OutputApiAuditLog[]>(url, axiosOptions)
    expect(result2.status).toEqual(HttpStatusCode.Ok)

    expect(Array.isArray(result2.data)).toBeTruthy()
    const messageIds = result2.data.map((record) => record.messageId)
    expect(messageIds).toContain(auditLog.messageId)
  })

  it("should filter by status", async () => {
    const auditLog = await createMockAuditLog()
    if (isError(auditLog)) {
      throw auditLog
    }

    const auditLog2 = await createMockError()
    if (isError(auditLog2)) {
      throw auditLog2
    }

    const result = await axios.get<OutputApiAuditLog[]>(`${url}?status=Error`, axiosOptions)
    expect(result.status).toEqual(HttpStatusCode.Ok)

    expect(Array.isArray(result.data)).toBeTruthy()
    const messageIds = result.data.map((record) => record.messageId)
    expect(messageIds).toContain(auditLog2.messageId)
  })

  it("should filter by hash", async () => {
    const auditLog = await createMockAuditLog()
    if (isError(auditLog)) {
      throw auditLog
    }

    const auditLog2 = await createMockAuditLog()
    if (isError(auditLog2)) {
      throw auditLog2
    }

    const result = await axios.get<OutputApiAuditLog[]>(`${url}?messageHash=${auditLog2.messageHash}`, axiosOptions)
    expect(result.status).toEqual(HttpStatusCode.Ok)

    expect(result.data).toHaveLength(1)
    expect(result.data[0].messageId).toBe(auditLog2.messageId)
  })

  it("should get message by external correlation ID", async () => {
    const auditLog = await createMockAuditLog()
    if (isError(auditLog)) {
      throw auditLog
    }

    const auditLog2 = await createMockAuditLog()
    if (isError(auditLog2)) {
      throw auditLog2
    }

    const result = await axios.get<OutputApiAuditLog[]>(
      `${url}?externalCorrelationId=${auditLog2.externalCorrelationId}`,
      axiosOptions
    )
    expect(result.status).toEqual(HttpStatusCode.Ok)

    expect(Array.isArray(result.data)).toBeTruthy()
    const messageIds = result.data.map((record) => record.messageId)
    expect(messageIds).toEqual([auditLog2.messageId])
  })

  describe("fetching unsanitised messages", () => {
    it("should return unsanitised messages", async () => {
      const unsanitisedAuditLog = await createMockAuditLog({
        isSanitised: 0
      })
      if (isError(unsanitisedAuditLog)) {
        throw unsanitisedAuditLog
      }

      const sanitisedAuditLog = await createMockAuditLog({ isSanitised: 1 })
      if (isError(sanitisedAuditLog)) {
        throw sanitisedAuditLog
      }

      const result = await axios.get<OutputApiAuditLog[]>(`${url}?unsanitised=true`, axiosOptions)
      expect(result.status).toEqual(HttpStatusCode.Ok)

      expect(Array.isArray(result.data)).toBeTruthy()
      const messageIds = result.data.map((record) => record.messageId)
      expect(messageIds).toContain(unsanitisedAuditLog.messageId)
      expect(messageIds).not.toContain(sanitisedAuditLog.messageId)
    })
  })

  describe("fetching messages with a filter on the events (automationRate)", () => {
    it("should return messages in the correct time range", async () => {
      const promises = [
        "2022-01-01T00:00:00.000Z",
        "2022-01-02T00:00:00.000Z",
        "2022-01-03T00:00:00.000Z",
        "2022-01-04T00:00:00.000Z"
      ].map((receivedDate) => createMockAuditLog({ receivedDate }))
      const createResults = await Promise.all(promises)

      if (
        isError(createResults[0]) ||
        isError(createResults[1]) ||
        isError(createResults[2]) ||
        isError(createResults[3])
      ) {
        throw new Error("Unexpected error")
      }

      const result = await axios.get<OutputApiAuditLog[]>(
        `${url}?eventsFilter=automationReport&start=2022-01-02&end=2022-01-03`,
        axiosOptions
      )
      expect(result.status).toEqual(HttpStatusCode.Ok)

      expect(Array.isArray(result.data)).toBeTruthy()
      const messageIds = result.data.map((record) => record.messageId)
      expect(messageIds).not.toContain(createResults[0].messageId)
      expect(messageIds).toContain(createResults[1].messageId)
      expect(messageIds).toContain(createResults[2].messageId)
      expect(messageIds).not.toContain(createResults[3].messageId)
    })
  })

  describe("fetchAutomationReport", () => {
    it("should only include events for automation report", async () => {
      const auditLog = await createMockAuditLog()
      if (isError(auditLog)) {
        throw auditLog
      }

      const eventInclude = await createMockAuditLogEvent(auditLog.messageId, {
        eventCode: EventCode.ExceptionsGenerated
      })
      if (isError(eventInclude)) {
        throw eventInclude
      }

      const eventExclude = await createMockAuditLogEvent(auditLog.messageId)
      if (isError(eventExclude)) {
        throw eventExclude
      }

      const allResult = await axios.get<OutputApiAuditLog[]>(url, axiosOptions)
      expect(allResult.status).toEqual(HttpStatusCode.Ok)
      expect(allResult.data[0]).toHaveProperty("events")
      expect(allResult.data[0].events).toHaveLength(2)

      const filteredResult = await axios.get<OutputApiAuditLog[]>(
        `${url}?eventsFilter=automationReport&start=2000-01-01&end=2099-01-01`,
        axiosOptions
      )
      expect(filteredResult.status).toEqual(HttpStatusCode.Ok)
      expect(filteredResult.data[0]).toHaveProperty("events")
      expect(filteredResult.data[0].events).toHaveLength(1)
      expect(filteredResult.data[0].events?.[0].eventType).toBe(eventInclude.eventType)
    })
  })

  describe("fetchTopExceptionsReport", () => {
    it("should only include events for top exceptions report", async () => {
      const auditLog = await createMockAuditLog()
      if (isError(auditLog)) {
        throw auditLog
      }

      const eventInclude = await createMockAuditLogEvent(auditLog.messageId, {
        attributes: { "Error 1 Details": "HO100300", "Message Type": "SPIResults" },
        eventCode: EventCode.ExceptionsGenerated
      })
      if (isError(eventInclude)) {
        throw eventInclude
      }

      const eventExclude = await createMockAuditLogEvent(auditLog.messageId)
      if (isError(eventExclude)) {
        throw eventExclude
      }

      const allResult = await axios.get<OutputApiAuditLog[]>(url, axiosOptions)
      expect(allResult.status).toEqual(HttpStatusCode.Ok)
      expect(allResult.data[0]).toHaveProperty("events")
      expect(allResult.data[0].events).toHaveLength(2)

      const filteredResult = await axios.get<OutputApiAuditLog[]>(
        `${url}?eventsFilter=topExceptionsReport&start=2000-01-01&end=2099-01-01`,
        axiosOptions
      )
      expect(filteredResult.status).toEqual(HttpStatusCode.Ok)
      expect(filteredResult.data[0]).toHaveProperty("events")
      expect(filteredResult.data[0].events).toHaveLength(1)
      expect(filteredResult.data[0].events?.[0].eventType).toBe(eventInclude.eventType)
    })

    it("should paginate the results using the last message ID", async () => {
      const auditLogs = await createMockAuditLogs(5)
      if (isError(auditLogs)) {
        throw auditLogs
      }

      const result = await axios.get<OutputApiAuditLog[]>(
        `${url}?eventsFilter=topExceptionsReport&start=2000-01-01&end=2099-01-01&lastMessageId=${auditLogs[2].messageId}`,
        axiosOptions
      )

      expect(result.data).toHaveLength(2)
      expect(result.data[0].messageId).toBe(auditLogs[1].messageId)
      expect(result.data[1].messageId).toBe(auditLogs[0].messageId)
    })
  })

  describe("including and excluding columns", () => {
    describe.each(
      // prettier-ignore
      [
        ["fetchAll",                     createMockAuditLog, (_: DynamoAuditLog) => url, undefined],
        ["fetchUnsanitised",             createMockAuditLog, (_: DynamoAuditLog) => `${url}?unsanitised=true`, undefined],
        // ["fetchById",                    createMockAuditLog, (l: DynamoAuditLog) => `${url}/${l.messageId}`, undefined],
        ["fetchByHash",                  createMockAuditLog, (l: DynamoAuditLog) => `${url}?messageHash=${l.messageHash}`, "messageHash"],
        ["fetchByExternalCorrelationId", createMockAuditLog, (l: DynamoAuditLog) => `${url}?externalCorrelationId=${l.externalCorrelationId}`, undefined],
        ["fetchByStatus",                createMockError,    (_: DynamoAuditLog) => `${url}?status=Error`, undefined]
      ]
    )("from %s", (_, newAuditLog, baseUrl, indexKey) => {
      it("should not show excluded columns", async () => {
        const auditLog = await newAuditLog()
        if (isError(auditLog)) {
          throw new Error("Unexpected error")
        }

        const defaultResult = await axios.get<OutputApiAuditLog[]>(baseUrl(auditLog), axiosOptions)
        expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
        expect(defaultResult.data[0]).toHaveProperty("events")
        expect(defaultResult.data[0]).toHaveProperty("receivedDate")
        const defaultKeys = Object.keys(defaultResult.data[0])

        const excludedResult = await axios.get<OutputApiAuditLog[]>(
          addQueryParams(baseUrl(auditLog), { excludeColumns: "receivedDate,events" }),
          axiosOptions
        )

        expect(excludedResult.status).toEqual(HttpStatusCode.Ok)
        expect(excludedResult.data[0]).not.toHaveProperty("events")
        expect(excludedResult.data[0]).not.toHaveProperty("receivedDate")
        expect(Object.keys(excludedResult.data[0])).toHaveLength(defaultKeys.length - 2)
      })

      it("should show included columns", async () => {
        const auditLog = await newAuditLog()
        if (isError(auditLog)) {
          throw new Error("Unexpected error")
        }

        const defaultResult = await axios.get<OutputApiAuditLog[]>(baseUrl(auditLog), axiosOptions)
        expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
        expect("messageHash" in defaultResult.data[0]).toBe(indexKey === "messageHash")
        const expectedKeys = new Set(Object.keys(defaultResult.data[0]))
        if (indexKey) {
          expectedKeys.add(indexKey)
        }

        const includedResult = await axios.get<OutputApiAuditLog[]>(
          addQueryParams(baseUrl(auditLog), { includeColumns: "messageHash" }),
          axiosOptions
        )

        expectedKeys.add("messageHash")
        expect(includedResult.status).toEqual(HttpStatusCode.Ok)
        expect(includedResult.data[0]).toHaveProperty("messageHash")
        expect(Object.keys(includedResult.data[0])).toHaveLength([...expectedKeys].length)
      })

      it("should work with excluded and included columns", async () => {
        const auditLog = await newAuditLog()
        if (isError(auditLog)) {
          throw new Error("Unexpected error")
        }

        const defaultResult = await axios.get<OutputApiAuditLog[]>(baseUrl(auditLog), axiosOptions)
        expect(defaultResult.status).toEqual(HttpStatusCode.Ok)
        expect("messageHash" in defaultResult.data[0]).toBe(indexKey === "messageHash")
        expect(defaultResult.data[0]).toHaveProperty("events")
        expect(defaultResult.data[0]).toHaveProperty("receivedDate")

        const filteredResult = await axios.get<OutputApiAuditLog[]>(
          addQueryParams(baseUrl(auditLog), {
            excludeColumns: "receivedDate,events",
            includeColumns: "messageHash"
          }),
          axiosOptions
        )

        expect(filteredResult.status).toEqual(HttpStatusCode.Ok)
        expect(filteredResult.data[0]).toHaveProperty("messageHash")
        expect(filteredResult.data[0]).not.toHaveProperty("events")
        expect(filteredResult.data[0]).not.toHaveProperty("receivedDate")
      })
    })
  })

  describe("pagination", () => {
    describe.each(
      // prettier-ignore
      [
        ["fetchAll",             true,   () => url],
        ["fetchUnsanitised",     false,  () => `${url}?unsanitised=true`],
        ["fetchByStatus",        true,   () => `${url}?status=Processing`],
        ["fetchTopExceptions",   true,   () => `${url}?eventsFilter=topExceptionsReport&start=2000-01-01&end=2099-01-01`],
        ["fetchAutomation",      true,   () => `${url}?eventsFilter=automationReport&start=2000-01-01&end=2099-01-01`]
      ]
    )("for %s", (x, descending, baseUrl) => {
      it("should limit the number of records", async () => {
        const auditLogs = await createMockAuditLogs(2)
        if (isError(auditLogs)) {
          throw auditLogs
        }

        const result = await axios.get<OutputApiAuditLog[]>(addQueryParams(baseUrl(), { limit: "1" }), axiosOptions)

        expect(result.data).toHaveLength(1)
      })

      it("should paginate by last record ID", async () => {
        const auditLogs = await createMockAuditLogs(5)
        if (isError(auditLogs)) {
          throw auditLogs
        }

        const result = await axios.get<OutputApiAuditLog[]>(
          addQueryParams(baseUrl(), { lastMessageId: auditLogs[2].messageId }),
          axiosOptions
        )

        expect(result.data).toHaveLength(2)

        // determine which keys will be returned based on the sort order
        const keys = descending ? [1, 0] : [3, 4]
        expect(result.data[0].messageId).toBe(auditLogs[keys[0]].messageId)
        expect(result.data[1].messageId).toBe(auditLogs[keys[1]].messageId)
      })
    })
  })
})
