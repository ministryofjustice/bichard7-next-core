import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"
import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
import type ErrorListRecord from "../../phase1/types/ErrorListRecord"
import { type AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import insertErrorListRecord from "./insertErrorListRecord"

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

describe("insertErrorListRecord", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
  })

  it("should insert the result into the error_list table", async () => {
    const result = generateMockPhase1Result()
    const recordId = await insertErrorListRecord(db, result)

    expect(recordId).toBeDefined()

    const insertedRecord = (
      await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list WHERE error_id = ${recordId}`
    )[0]

    const hearingOutcome = result.hearingOutcome as AnnotatedHearingOutcome
    const messageId = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    expect(insertedRecord.message_id).toBe(messageId)
  })
})
