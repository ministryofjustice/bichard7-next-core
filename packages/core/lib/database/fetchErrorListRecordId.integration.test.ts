import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { randomUUID } from "crypto"
import postgres from "postgres"

import type ErrorListRecord from "../../types/ErrorListRecord"

import fetchErrorListRecordId from "./fetchErrorListRecordId"

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
