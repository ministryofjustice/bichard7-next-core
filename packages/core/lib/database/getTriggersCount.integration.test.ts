import type { Sql } from "postgres"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import postgres from "postgres"

import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"

import getTriggersCount from "./getTriggersCount"

const dbConfig = createDbConfig()
const db = postgres({
  ...dbConfig,
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

const generateErrorListRecord = (input: Partial<ErrorListRecord> = {}): ErrorListRecord => ({
  annotated_msg: "",
  court_reference: "",
  create_ts: new Date(),
  error_count: 0,
  error_id: 111,
  error_report: "",
  is_urgent: 0,
  message_id: randomUUID(),
  msg_received_ts: new Date(),
  phase: 1,
  trigger_count: 0,
  updated_msg: "",
  user_updated_flag: 0,
  ...input
})

const generateErrorListTriggerRecord = (errorId: number): ErrorListTriggerRecord => ({
  create_ts: new Date(),
  error_id: errorId,
  resolved_by: null,
  resolved_ts: null,
  status: 0,
  trigger_code: "TRPR0018",
  trigger_id: 1,
  trigger_item_identity: null
})

const errorListRecord = generateErrorListRecord()

describe("getTriggersCount", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
    await db`DELETE FROM br7own.error_list_triggers`
  })

  it("returns 1 when a trigger exist for a record", async () => {
    const errors = await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING error_id`
    const errorListTriggersRecord = generateErrorListTriggerRecord(errors[0].error_id ?? 1)
    await db<ErrorListTriggerRecord[]>`INSERT INTO br7own.error_list_triggers ${db(errorListTriggersRecord)}`
    const correlationId = errorListRecord.message_id

    const triggersCount = await getTriggersCount(db, correlationId)

    expect(triggersCount).toBe(1)
  })

  it("returns 2 when 2 triggers exist for a record", async () => {
    const errors = await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING error_id`
    const errorListTriggersRecord = generateErrorListTriggerRecord(errors[0].error_id ?? 1)
    await db<ErrorListTriggerRecord[]>`INSERT INTO br7own.error_list_triggers ${db(errorListTriggersRecord)}`
    await db<ErrorListTriggerRecord[]>`INSERT INTO br7own.error_list_triggers ${db(errorListTriggersRecord)}`
    const correlationId = errorListRecord.message_id

    const triggersCount = await getTriggersCount(db, correlationId)

    expect(triggersCount).toBe(2)
  })

  it("returns 0 when triggers do not exist for a record", async () => {
    await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING error_id`
    const correlationId = errorListRecord.message_id

    const triggersCount = await getTriggersCount(db, correlationId)

    expect(triggersCount).toBe(0)
  })

  it("handles errors", async () => {
    const errorMessage = "Database error"
    const mockedDb = jest.fn().mockRejectedValue(new Error("Database error")) as unknown as Sql

    const triggersCount = await getTriggersCount(mockedDb, "correlationId")

    expect(isError(triggersCount)).toBe(true)
    expect((triggersCount as Error).message).toBe(errorMessage)
  })
})
