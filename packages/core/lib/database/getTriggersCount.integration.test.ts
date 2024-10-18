import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import getTriggersCount from "./getTriggersCount"
import postgres from "postgres"
import type ErrorListRecord from "../../types/ErrorListRecord"
import { randomUUID } from "crypto"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"

const dbConfig = createDbConfig()
const db = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

const generateErrorListRecord = (input: Partial<ErrorListRecord> = {}): ErrorListRecord => ({
  message_id: randomUUID(),
  error_id: 111,
  phase: 1,
  trigger_count: 0,
  is_urgent: 0,
  annotated_msg: "",
  updated_msg: "",
  error_report: "",
  create_ts: new Date(),
  error_count: 0,
  user_updated_flag: 0,
  msg_received_ts: new Date(),
  court_reference: "",
  ...input
})

const generateErrorListTriggerRecord = (errorId: number): ErrorListTriggerRecord => ({
  trigger_id: 1,
  error_id: errorId,
  trigger_code: "TRPR0018",
  trigger_item_identity: null,
  status: 0,
  create_ts: new Date(),
  resolved_by: null,
  resolved_ts: null
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

    const triggersCount = await getTriggersCount(correlationId)

    expect(triggersCount).toBe(1)
  })

  it("returns 2 when 2 triggers exist for a record", async () => {
    const errors = await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING error_id`
    const errorListTriggersRecord = generateErrorListTriggerRecord(errors[0].error_id ?? 1)
    await db<ErrorListTriggerRecord[]>`INSERT INTO br7own.error_list_triggers ${db(errorListTriggersRecord)}`
    await db<ErrorListTriggerRecord[]>`INSERT INTO br7own.error_list_triggers ${db(errorListTriggersRecord)}`
    const correlationId = errorListRecord.message_id

    const triggersCount = await getTriggersCount(correlationId)

    expect(triggersCount).toBe(2)
  })

  it("returns 0 when triggers do not exist for a record", async () => {
    await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING error_id`
    const correlationId = errorListRecord.message_id

    const triggersCount = await getTriggersCount(correlationId)

    expect(triggersCount).toBe(0)
  })
})
