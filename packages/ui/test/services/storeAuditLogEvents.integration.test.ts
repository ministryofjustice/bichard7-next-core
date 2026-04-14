import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import { randomUUID } from "crypto"
import getDataSource from "services/getDataSource"
import { storeMessageAuditLogEvents } from "services/storeAuditLogEvents"
import type { DataSource } from "typeorm"
import { isError } from "types/Result"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import createAuditLog from "../helpers/createAuditLog"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"

const originalFetch = global.fetch

describe("storeAuditLogEvents", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")

    global.fetch = jest.fn().mockImplementation(originalFetch)
  }, 20_000)

  it("Should store audit log events in dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent(EventCode.ReportRun, EventCategory.information, "dummyEventSource", {
      key1: "value1"
    })
    const auditLog = await createAuditLog()

    const result = await storeMessageAuditLogEvents(auditLog.messageId, [expectedEvent]).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    const response = await fetch(`${AUDIT_LOG_API_URL}/messages/${auditLog.messageId}`)
    const data = await response.json()
    const [record] = data

    expect(record.events).toEqual([
      {
        attributes: { key1: "value1" },
        category: "information",
        eventSource: "dummyEventSource",
        eventCode: "report-run",
        eventType: auditLogEventLookup[EventCode.ReportRun],
        timestamp: expect.anything()
      }
    ])
  })

  it("Should return undefined with no error if events array is empty", async () => {
    const result = await storeMessageAuditLogEvents(randomUUID(), []).catch((error) => error)
    expect(isError(result)).toBeFalsy()
    expect(result).toBeUndefined()
  })

  it("should pass through the api key as a header", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200
    })

    const result = await storeMessageAuditLogEvents("dummy_key", [{} as AuditLogEvent]).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    expect(global.fetch).toHaveBeenCalledWith(
      `${AUDIT_LOG_API_URL}/messages/dummy_key/events`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "X-API-Key": AUDIT_LOG_API_KEY,
          "Content-Type": "application/json"
        },
        body: "[{}]"
      })
    )
  })
})
