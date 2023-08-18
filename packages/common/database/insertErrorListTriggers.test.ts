import generateMockPhase1Result from "@moj-bichard7/core/phase1/tests/helpers/generateMockPhase1Result"
import type ErrorListNoteRecord from "@moj-bichard7/core/phase1/types/ErrorListNoteRecord"
import { TriggerCode } from "@moj-bichard7/core/types/TriggerCode"
import postgres from "postgres"
import createDbConfig from "./createDbConfig"
import insertErrorListRecord from "./insertErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"

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

const snapshotExclusions = {
  create_ts: expect.any(Date),
  error_id: expect.any(Number),
  trigger_id: expect.any(Number)
}

describe("insertErrorListTriggers", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
    await db`DELETE FROM br7own.error_list_triggers`
  })

  it("should insert the error list triggers", async () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0001, offenceSequenceNumber: 3 }]
    })

    const recordId = await insertErrorListRecord(db, phase1Result)
    await insertErrorListTriggers(db, recordId, phase1Result.triggers)

    const insertedRecords = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

    expect(insertedRecords).toHaveLength(2)
    expect(insertedRecords[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedRecords[1]).toMatchSnapshot(snapshotExclusions)
  })
})
