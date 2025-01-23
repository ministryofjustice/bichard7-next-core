import type { AxiosRequestConfig } from "axios"
import type { FastifyInstance } from "fastify"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import axios, { HttpStatusCode } from "axios"

import type { DynamoAuditLog, InputApiAuditLog } from "../../../../types/AuditLog"

import { V1 } from "../../../../endpoints/versionedEndpoints"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../../tests/helpers/jwtHelper"
import { mockApiAuditLogEvent, mockInputApiAuditLog } from "../../../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import EventCode from "../../../../types/EventCode"

const jwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const axiosOptions: AxiosRequestConfig = {
  headers: { Authorization: `Bearer ${jwt}` },
  validateStatus: () => true
}

const gateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

describe("createAuditLogEvents", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let auditLogsUrl: string
  let eventsUrl: string
  let auditLog: InputApiAuditLog

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    eventsUrl = `${helper.address}${V1.AuditLogEvents}`
    auditLogsUrl = `${helper.address}${V1.AuditLogs}`
    app = helper.app
  })

  beforeEach(async () => {
    await helper.dynamo.clearDynamo()

    auditLog = mockInputApiAuditLog()
    const result1 = await axios.post(auditLogsUrl, auditLog, axiosOptions)
    expect(result1.status).toEqual(HttpStatusCode.Created)
  })

  afterAll(async () => {
    await app.close()
    await helper.db.close()
  })

  describe("Creating multiple Audit Log events", () => {
    it("should create many new audit log events for an existing audit log record", async () => {
      const events = new Array(10).fill(0).map((_, index) => mockApiAuditLogEvent({ eventType: `Test event ${index}` }))
      const result = await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), events, axiosOptions)
      expect(result.status).toEqual(HttpStatusCode.Created)

      const record = (await gateway.fetchOne(auditLog.messageId)) as DynamoAuditLog

      const { events: dynamoEvents, messageId } = record!
      expect(messageId).toEqual(auditLog.messageId)

      expect(dynamoEvents).toHaveLength(10)
      const eventTypes = events.map((e) => e.eventType)
      dynamoEvents?.forEach((event) => {
        expect(eventTypes).toContain(event.eventType)
      })
    })
  })

  describe("Creating a single Audit Log event", () => {
    it("should create a single new audit log event for an existing audit log record", async () => {
      const event = mockApiAuditLogEvent()
      const result = await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)
      expect(result.status).toEqual(HttpStatusCode.Created)

      const record = (await gateway.fetchOne(auditLog.messageId)) as DynamoAuditLog

      expect(record).not.toBeNull()

      const { events, messageId } = record!
      expect(messageId).toEqual(auditLog.messageId)

      expect(events).toBeDefined()
      expect(events).toHaveLength(1)

      const actualEvent = events?.[0]
      expect(actualEvent).toMatchObject({
        attributes: event.attributes,
        category: event.category,
        eventCode: event.eventCode,
        eventSource: event.eventSource,
        eventSourceQueueName: event.eventSourceQueueName,
        eventType: event.eventType,
        eventXml: event.eventXml,
        timestamp: event.timestamp
      })
    })

    it("should transform the audit log event before saving", async () => {
      const event = mockApiAuditLogEvent({ attributes: { eventCode: "test.event", user: "Test User" } })
      const result = await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)
      expect(result.status).toEqual(HttpStatusCode.Created)

      const record = (await gateway.fetchOne(auditLog.messageId)) as DynamoAuditLog

      expect(record).not.toBeNull()

      const { events, messageId } = record!
      expect(messageId).toEqual(auditLog.messageId)

      expect(events).toHaveLength(1)

      const actualEvent = events?.[0]
      expect(actualEvent).toHaveProperty("user", "Test User")
      expect(actualEvent).toHaveProperty("eventCode", "test.event")
    })

    describe("updating the PNC status", () => {
      const getPncStatus = async (messageId: string): Promise<string | undefined> => {
        const record = (await gateway.fetchOne(messageId)) as DynamoAuditLog
        return record?.pncStatus
      }

      it("should update the status with each event", async () => {
        const auditLog = mockInputApiAuditLog()
        await axios.post(auditLogsUrl, auditLog, axiosOptions)

        let pncStatus = await getPncStatus(auditLog.messageId)
        expect(pncStatus).toBe("Processing")

        let event = mockApiAuditLogEvent({ eventCode: EventCode.ExceptionsGenerated })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        pncStatus = await getPncStatus(auditLog.messageId)
        expect(pncStatus).toBe("Exceptions")

        event = mockApiAuditLogEvent({ eventCode: EventCode.ExceptionsResolved })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        pncStatus = await getPncStatus(auditLog.messageId)
        expect(pncStatus).toBe("ManuallyResolved")

        event = mockApiAuditLogEvent({ eventCode: EventCode.IgnoredAppeal })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        pncStatus = await getPncStatus(auditLog.messageId)
        expect(pncStatus).toBe("Ignored")

        event = mockApiAuditLogEvent({ eventCode: EventCode.PncUpdated })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        pncStatus = await getPncStatus(auditLog.messageId)
        expect(pncStatus).toBe("Updated")
      })
    })

    describe("updating the Trigger status", () => {
      const getTriggerStatus = async (messageId: string): Promise<string | undefined> => {
        const record = (await gateway.fetchOne(messageId)) as DynamoAuditLog
        return record?.triggerStatus
      }

      it("should update the status with each event", async () => {
        const auditLog = mockInputApiAuditLog()
        await axios.post(auditLogsUrl, auditLog, axiosOptions)

        let triggerStatus = await getTriggerStatus(auditLog.messageId)
        expect(triggerStatus).toBe("NoTriggers")

        let event = mockApiAuditLogEvent({
          attributes: { "Trigger 1 Details": "TRPR0001" },
          eventCode: EventCode.TriggersGenerated
        })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        triggerStatus = await getTriggerStatus(auditLog.messageId)
        expect(triggerStatus).toBe("Generated")

        event = mockApiAuditLogEvent({
          attributes: { "Trigger 1 Details": "TRPR0001" },
          eventCode: EventCode.TriggersResolved
        })
        await axios.post(eventsUrl.replace(":correlationId", auditLog.messageId), event, axiosOptions)

        triggerStatus = await getTriggerStatus(auditLog.messageId)
        expect(triggerStatus).toBe("Resolved")
      })
    })
  })
})
