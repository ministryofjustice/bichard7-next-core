import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

import type ErrorListNoteRecord from "../../types/ErrorListNoteRecord"

import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
import insertErrorListNotes from "./insertErrorListNotes"
import insertErrorListRecord from "./insertErrorListRecord"

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

const snapshotExclusions = {
  create_ts: expect.any(Date),
  error_id: expect.any(Number),
  note_id: expect.any(Number)
}

describe("insertErrorListNotes", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
    await db`DELETE FROM br7own.error_list_notes`
  })

  it("should insert the error list notes", async () => {
    const notes = ["Trigger codes: 1 x TRPR0001.", "Error codes: 1 x HO100100."]
    const phase1Result = generateMockPhase1Result()

    const recordId = await insertErrorListRecord(db, phase1Result)
    await insertErrorListNotes(db, recordId, notes)

    const insertedRecords = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_notes WHERE error_id = ${recordId}`

    expect(insertedRecords).toHaveLength(2)
    expect(insertedRecords[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedRecords[1]).toMatchSnapshot(snapshotExclusions)
  })
})
