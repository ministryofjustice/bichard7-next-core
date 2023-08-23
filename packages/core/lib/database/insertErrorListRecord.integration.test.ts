import generateMockPhase1Result from "@moj-bichard7/core/phase1/tests/helpers/generateMockPhase1Result"
import type ErrorListRecord from "@moj-bichard7/core/phase1/types/ErrorListRecord"
import postgres from "postgres"
import createDbConfig from "lib/database/createDbConfig"
import insertErrorListRecord from "lib/database/insertErrorListRecord"

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

    const messageId = result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    expect(insertedRecord.message_id).toBe(messageId)
  })
})
