import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

import type ErrorListNoteRecord from "../../types/ErrorListNoteRecord"

import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
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

  it.each([0, undefined])(
    "should not add duplicate trigger when offence sequence number is %s",
    async (sequenceNumber) => {
      const originalTriggers = [{ code: TriggerCode.TRPR0003, offenceSequenceNumber: sequenceNumber }]
      let phase1Result = generateMockPhase1Result({
        triggers: [originalTriggers[0]]
      })
      const recordId = await insertErrorListRecord(db, phase1Result)
      await insertErrorListTriggers(db, recordId, phase1Result.triggers)
      await db`
      UPDATE br7own.error_list_triggers SET status = 2 WHERE error_id = ${recordId}`
      let dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

      expect(dbTriggers).toHaveLength(1)

      const newTrigger = { code: TriggerCode.TRPR0003, offenceSequenceNumber: sequenceNumber }
      phase1Result = generateMockPhase1Result({
        triggers: [newTrigger]
      })
      const updateResults = await updateErrorListTriggers(db, recordId, phase1Result)
      dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

      expect(dbTriggers).toHaveLength(1)
      expect(updateResults.deleted).toHaveLength(0)
      expect(updateResults.added).toHaveLength(0)
    }
  )

  it.each([
    { existingSequenceNumber: 0, newSequenceNumber: undefined },
    { existingSequenceNumber: undefined, newSequenceNumber: 0 }
  ])(
    "should add the trigger when existing trigger's offence sequence number is $existingSequenceNumber but the new trigger's offence sequence number is $newSequenceNumber",
    async ({ existingSequenceNumber, newSequenceNumber }) => {
      const originalTriggers = [{ code: TriggerCode.TRPR0003, offenceSequenceNumber: existingSequenceNumber }]
      let phase1Result = generateMockPhase1Result({
        triggers: [originalTriggers[0]]
      })
      const recordId = await insertErrorListRecord(db, phase1Result)
      await insertErrorListTriggers(db, recordId, phase1Result.triggers)
      await db`
      UPDATE br7own.error_list_triggers SET status = 2 WHERE error_id = ${recordId}`
      let dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

      expect(dbTriggers).toHaveLength(1)

      const newTrigger = { code: TriggerCode.TRPR0003, offenceSequenceNumber: newSequenceNumber }
      phase1Result = generateMockPhase1Result({
        triggers: [newTrigger]
      })
      const updateResults = await updateErrorListTriggers(db, recordId, phase1Result)
      dbTriggers = await db<ErrorListNoteRecord[]>`
      SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

      expect(dbTriggers).toHaveLength(2)
      expect(updateResults.deleted).toHaveLength(0)
      expect(updateResults.added).toHaveLength(1)
    }
  )
})
