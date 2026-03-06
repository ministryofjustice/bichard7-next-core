import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type { DynamoAuditLogUserEvent } from "../types/AuditLogEvent"

import { AuditLogDynamoGateway } from "../services/gateways/dynamo"
import auditLogDynamoConfig from "../tests/helpers/dynamoDbConfig"
import TestDynamoGateway from "../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import buildAuditLogUserEvent from "./auditLog/buildAuditLogUserEvent"
import createAuditLogUserEvent from "./createAuditLogUserEvents"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
const auditLogDynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

const reportAuditLogEvent = buildAuditLogUserEvent(
  "User1",
  EventCode.ReportRun,
  EventCategory.information,
  "Bichard New UI",
  {
    auditLogVersion: 2,
    "Date Range": "2026-01-01 to 2026-01-31",
    "Number of Records Returned": 31,
    "Output Format": "Viewed in UI",
    "Report ID": "Bail Conditions",
    "Time Taken": "50ms"
  }
)

describe("createAuditLogUserEvents", () => {
  beforeEach(async () => {
    await testDynamoGateway.clearDynamo()
  })

  it("creates a new auditLogUserEvents event", async () => {
    const result = await createAuditLogUserEvent([reportAuditLogEvent], auditLogDynamoGateway)

    expect(isError(result)).toBeFalsy()
  })

  it("can fetch audit log user events via event code", async () => {
    const createResult = await createAuditLogUserEvent([reportAuditLogEvent], auditLogDynamoGateway)

    expect(isError(createResult)).toBeFalsy()

    const getResult = await auditLogDynamoGateway.getUserEvents("report-run")

    expect(isError(getResult)).toBeFalsy()

    const events = getResult as DynamoAuditLogUserEvent[]

    expect(events[0]).toEqual(
      expect.objectContaining({
        _: "_",
        _automationReport: 0,
        _id: expect.any(String),
        _topExceptionsReport: 0,
        attributes: {
          auditLogVersion: 2,
          "Date Range": "2026-01-01 to 2026-01-31",
          "Number of Records Returned": 31,
          "Output Format": "Viewed in UI",
          "Report ID": "Bail Conditions",
          "Time Taken": "50ms"
        },
        category: "information",
        eventCode: "report-run",
        eventSource: "Bichard New UI",
        eventType: "Report run",
        timestamp: expect.any(String),
        user: "User1"
      })
    )
  })
})
