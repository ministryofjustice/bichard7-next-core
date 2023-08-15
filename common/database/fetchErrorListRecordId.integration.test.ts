import type ErrorListRecord from "core/phase1/src/types/ErrorListRecord"
import { randomUUID } from "crypto"
import postgres from "postgres"
import createDbConfig from "./createDbConfig"
import fetchErrorListRecordId from "./fetchErrorListRecordId"

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

describe("fetchErrorListRecordId", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
  })

  it("should fetch the record ID by correlation ID", async () => {
    const errorRecord = generateErrorListRecord()
    const insertedRecordId = await db<ErrorListRecord[]>`INSERT INTO br7own.error_list ${db(
      errorRecord
    )} RETURNING error_id`
    const recordId = await fetchErrorListRecordId(db, errorRecord.message_id)

    expect(recordId).toBeDefined()
    expect(recordId).toEqual(insertedRecordId[0].error_id)
  })
})
