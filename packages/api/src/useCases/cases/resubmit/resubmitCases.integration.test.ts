import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCases } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { minimalUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import FetchById from "../../fetchAuditLogs/FetchById"
import { resubmitCases } from "./resubmitCases"

describe("resubmitCases", () => {
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("will return an empty object", async () => {
    const nonSystemUser = minimalUser([UserGroup.Service])

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser, auditLogDynamoGateway)

    if (isError(result)) {
      throw new Error()
    }

    expect(result).toStrictEqual({})
  })

  it("needs the System user", async () => {
    const nonSystemUser = minimalUser([UserGroup.GeneralHandler])
    await createCases(testDatabaseGateway, 3, {
      0: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" },
      1: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" }
    })

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser, auditLogDynamoGateway)

    if (!isError(result)) {
      throw new Error()
    }

    expect(result.message).toBe("Missing System User")
  })

  it("will successfully resubmit 3 cases", async () => {
    const systemUser = minimalUser([UserGroup.Service], "System")
    const cases = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      1: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      2: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    const result = await resubmitCases(testDatabaseGateway.writable, systemUser, auditLogDynamoGateway)

    if (isError(result)) {
      throw result
    }

    for (const c of cases) {
      expect(result[c.messageId]).toBeDefined()
      expect(result[c.messageId]).not.toBeInstanceOf(Error)
      expect(result[c.messageId]).toHaveProperty("errorId", c.errorId)
      expect(result[c.messageId]).toHaveProperty("events.length", 1)
    }

    const auditLogJson = await new FetchById(testDynamoGateway, cases[0].messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]
    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard API Auto Resubmit")
    expect(auditLogEvent?.user).toBe(systemUser.username)
  })
})
