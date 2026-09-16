import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import postgres from "postgres"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { updateTriggers } from "./updateTriggers"

const testDatabaseGateway = new End2EndPostgres()

const db = postgres({
  ...createDbConfig,
  types: {
    date: {
      from: [1082],
      parse: (x: string): Date => {
        return new Date(x)
      },
      serialize: (x: string): string => x,
      to: 25
    }
  }
})

describe("updateTriggers", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should successfully resolve unresolved triggers and append an audit log event", async () => {
    const auditLogEvents: ApiAuditLogEvent[] = []
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })

    const caseObj = await createCase(testDatabaseGateway)

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: "TRPR0001", triggerId: 1 },
      { triggerCode: "TRPR0002", triggerId: 2 }
    ])

    let result: Error | number | undefined

    await testDatabaseGateway.writable.transaction(async (tx) => {
      result = await updateTriggers(tx, user, [1, 2], auditLogEvents)
    })

    expect(isError(result)).toBe(false)
    expect(result).toBe(2)

    expect(auditLogEvents).toHaveLength(1)
    const auditEvent = auditLogEvents[0]
    expect(auditEvent.eventCode).toBe(EventCode.TriggersResolved)
    expect(auditEvent.category).toBe(EventCategory.information)
    expect(auditEvent.attributes).toHaveProperty("user", "test_user")
    expect(auditEvent.attributes).toHaveProperty("Number Of Triggers", 2)

    const triggerRecords =
      await db`SELECT status, resolved_by, resolved_ts FROM br7own.error_list_triggers WHERE trigger_id IN (${1}, ${2})`
    expect(triggerRecords).toHaveLength(2)
  })

  // it("should return an UnprocessableEntityError if the triggers do not exist or are already resolved", async () => {
  //   const auditLogEvents: ApiAuditLogEvent[] = []
  //   const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
  //   const caseObj = await createCase(testDatabaseGateway)

  //   await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: "TRPR0001", triggerId: 1 }])

  //   await testDatabaseGateway.writable.transaction(async (tx) => {
  //     await updateTriggers(tx, user, [1], [])
  //   })

  //   let result: number | Error | undefined

  //   // Try to resolve the same trigger again, which should fail
  //   await testDatabaseGateway.writable.transaction(async (tx) => {
  //     result = await updateTriggers(tx, user, [1], auditLogEvents)
  //   })

  //   expect(isError(result)).toBe(true)
  //   expect(result).toBeInstanceOf(UnprocessableEntityError)
  //   expect((result as Error).message).toContain(`Couldn't update triggers ids: ${1}`)
  //   expect(auditLogEvents).toHaveLength(0)
  // })

  // it("should return a standard Error if the database query fails", async () => {
  //   const auditLogEvents: ApiAuditLogEvent[] = []
  //   const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler], username: "test_user" })
  //   const triggerIds = [1, 2]

  //   const brokenTx = {
  //     connection: jest.fn().mockRejectedValue(new Error("Simulated Database Error"))
  //   }
  //   brokenTx.connection.mockImplementation(() => {
  //     throw new Error("Simulated Database Error")
  //   })

  //   const result = await updateTriggers(brokenTx as any, user, triggerIds, auditLogEvents)

  //   expect(isError(result)).toBe(true)
  //   expect(result).toBeInstanceOf(Error)
  //   expect((result as Error).message).toContain(`Couldn't update triggers trigger ids:1,2: Simulated Database Error`)

  //   expect(auditLogEvents).toHaveLength(0)
  // })
})
