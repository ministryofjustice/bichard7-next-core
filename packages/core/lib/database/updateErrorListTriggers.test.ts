import generateMockPhase1Result from "@moj-bichard7/core/phase1/tests/helpers/generateMockPhase1Result"
import type ErrorListNoteRecord from "@moj-bichard7/core/phase1/types/ErrorListNoteRecord"
import { TriggerCode } from "@moj-bichard7/core/types/TriggerCode"
import postgres from "postgres"
import createDbConfig from "./createDbConfig"
import insertErrorListRecord from "./insertErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"
import updateErrorListTriggers from "./updateErrorListTriggers"

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

describe("updateErrorListTriggers", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
    await db`DELETE FROM br7own.error_list_triggers`
  })

  it("should add and remove triggers as required", async () => {
    const originalTriggers = [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0001, offenceSequenceNumber: 3 }]
    const phase1Result = generateMockPhase1Result({
      triggers: [originalTriggers[0], originalTriggers[1]]
    })
    const recordId = await insertErrorListRecord(db, phase1Result)
    await insertErrorListTriggers(db, recordId, phase1Result.triggers)
    let dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

    expect(dbTriggers).toHaveLength(2)

    const newTrigger = { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }
    phase1Result.triggers.push(newTrigger)
    let updateResults = await updateErrorListTriggers(db, recordId, phase1Result)
    dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

    expect(dbTriggers).toHaveLength(3)
    expect(updateResults.deleted).toHaveLength(0)
    expect(updateResults.added).toStrictEqual([newTrigger])

    phase1Result.triggers = [originalTriggers[0]]

    updateResults = await updateErrorListTriggers(db, recordId, phase1Result)
    dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

    expect(dbTriggers).toHaveLength(1)
    expect(updateResults.deleted).toStrictEqual([originalTriggers[1], newTrigger])
    expect(updateResults.added).toHaveLength(0)
  })
})
