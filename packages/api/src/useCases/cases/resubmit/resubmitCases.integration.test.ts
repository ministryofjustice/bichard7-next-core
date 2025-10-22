jest.mock("../../../services/db/cases/incrementPncFailureResubmissions")

import type { CaseRow } from "@moj-bichard7/common/types/Case"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import * as incrementPncFailureResubmissions from "../../../services/db/cases/incrementPncFailureResubmissions"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCases } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { minimalUser } from "../../../tests/helpers/userHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import FetchById from "../../fetchAuditLogs/FetchById"
import { resubmitCases } from "./resubmitCases"

const originalIncrement = jest.requireActual("../../../services/db/cases/incrementPncFailureResubmissions")

describe("resubmitCases", () => {
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()

    jest.clearAllMocks()
    jest.spyOn(incrementPncFailureResubmissions, "default").mockImplementation(originalIncrement.default)
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

  it("increments the total PNC failure resubmission count", async () => {
    const serviceUser = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    const [caseRow] = await createCases(testDatabaseGateway, 1, {
      0: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" }
    })

    expect(caseRow.totalPncFailureResubmissions).toBe(0)

    const result = await resubmitCases(testDatabaseGateway.writable, serviceUser, auditLogDynamoGateway)

    if (isError(result)) {
      throw new Error()
    }

    const [caseObj] = await testDatabaseGateway.writable.connection<CaseRow[]>`
      SELECT *
      FROM br7own.error_list el
      WHERE el.error_id = ${caseRow.errorId}
    `

    expect(caseObj.total_pnc_failure_resubmissions).toBe(1)
  })

  it("will unlock the case if it fails", async () => {
    const serviceUser = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    const [caseRow] = await createCases(testDatabaseGateway, 1, {
      0: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" }
    })

    jest.spyOn(incrementPncFailureResubmissions, "default").mockResolvedValue(new Error("DB error"))

    const result = await resubmitCases(testDatabaseGateway.writable, serviceUser, auditLogDynamoGateway)

    if (isError(result)) {
      throw new Error()
    }

    const [caseObj] = await testDatabaseGateway.writable.connection<CaseRow[]>`
      SELECT *
      FROM br7own.error_list el
      WHERE el.error_id = ${caseRow.errorId}
    `

    expect(caseObj.error_locked_by_id).toBeNull()
  })

  it("will Audit Log the case unlocking if it fails", async () => {
    const serviceUser = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    const [caseRow] = await createCases(testDatabaseGateway, 1, {
      0: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" }
    })

    jest.spyOn(incrementPncFailureResubmissions, "default").mockResolvedValue(new Error("DB error"))

    const result = await resubmitCases(testDatabaseGateway.writable, serviceUser, auditLogDynamoGateway)

    if (isError(result)) {
      throw new Error()
    }

    const auditLogJson = await new FetchById(testDynamoGateway, caseRow.messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(2)

    const auditLogEvent = auditLogObj.events?.[0]
    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard API Auto Resubmit")
    expect(auditLogEvent?.user).toBe(serviceUser.username)

    const auditLogEvent2 = auditLogObj.events?.[1]
    expect(auditLogEvent2?.category).toBe(EventCategory.information)
    expect(auditLogEvent2?.eventCode).toBe(EventCode.ExceptionsUnlocked)
    expect(auditLogEvent2?.eventSource).toBe("Bichard API Auto Resubmit")
    expect(auditLogEvent2?.user).toBe(serviceUser.username)
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
