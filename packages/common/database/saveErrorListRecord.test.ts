jest.setTimeout(9999999)

import errorPaths from "@moj-bichard7/core/phase1/lib/errorPaths"
import generateMockPhase1Result from "@moj-bichard7/core/phase1/tests/helpers/generateMockPhase1Result"
import type ErrorListRecord from "@moj-bichard7/core/phase1/types/ErrorListRecord"
import type ErrorListTriggerRecord from "@moj-bichard7/core/phase1/types/ErrorListTriggerRecord"
import { ExceptionCode } from "@moj-bichard7/core/types/ExceptionCode"
import { TriggerCode } from "@moj-bichard7/core/types/TriggerCode"
import postgres from "postgres"
import createDbConfig from "./createDbConfig"
import saveErrorListRecord from "./saveErrorListRecord"

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
  note_id: expect.any(Number)
}

describe("saveErrorListRecord", () => {
  beforeEach(async () => {
    await db`DELETE FROM br7own.error_list`
    await db`DELETE FROM br7own.error_list_triggers`
    await db`DELETE FROM br7own.error_list_notes`
  })

  it("should insert the appropriate resources", async () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }],
      hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
    })

    await saveErrorListRecord(db, phase1Result)
    const errorListRecords = await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list`

    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_count).toBe(1)

    const insertedTriggers = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_triggers`

    expect(insertedTriggers).toHaveLength(1)
    expect(insertedTriggers[0].trigger_code).toEqual(phase1Result.triggers[0].code)

    const insertedNotes = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_notes`

    expect(insertedNotes).toHaveLength(2)
    expect(insertedNotes[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[1]).toMatchSnapshot(snapshotExclusions)
  })

  it("should update the error record and add new triggers with notes", async () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }],
      hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
    })

    await saveErrorListRecord(db, phase1Result)

    phase1Result.triggers.push({ code: TriggerCode.TRPR0002, offenceSequenceNumber: 2 })
    phase1Result.hearingOutcome.Exceptions.push({ code: ExceptionCode.HO100310, path: errorPaths.case.asn })

    await saveErrorListRecord(db, phase1Result)

    const errorListRecords = await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list`

    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_count).toBe(2)

    const insertedTriggers = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_triggers`

    expect(insertedTriggers).toHaveLength(2)
    expect(insertedTriggers[0].trigger_code).toEqual(phase1Result.triggers[0].code)
    expect(insertedTriggers[1].trigger_code).toEqual(phase1Result.triggers[1].code)

    const insertedNotes = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_notes`

    expect(insertedNotes).toHaveLength(4)
    expect(insertedNotes[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[1]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[2]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[3]).toMatchSnapshot(snapshotExclusions)
  })

  it("should update the error record and delete removed triggers with notes", async () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }],
      hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
    })

    await saveErrorListRecord(db, phase1Result)

    phase1Result.triggers = []

    await saveErrorListRecord(db, phase1Result)

    const errorListRecords = await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list`

    expect(errorListRecords).toHaveLength(1)

    const insertedTriggers = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_triggers`

    expect(insertedTriggers).toHaveLength(0)

    const insertedNotes = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_notes`

    expect(insertedNotes).toHaveLength(4)
    expect(insertedNotes[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[1]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[2]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[3]).toMatchSnapshot(snapshotExclusions)
  })

  it("should update the error record and add and remove triggers with notes", async () => {
    const phase1Result = generateMockPhase1Result({
      triggers: [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }],
      hearingOutcome: { Exceptions: [{ code: ExceptionCode.HO100100, path: errorPaths.case.asn }] }
    })

    await saveErrorListRecord(db, phase1Result)

    phase1Result.triggers = [{ code: TriggerCode.TRPR0002, offenceSequenceNumber: 2 }]
    phase1Result.hearingOutcome.Exceptions.push({ code: ExceptionCode.HO100310, path: errorPaths.case.asn })

    await saveErrorListRecord(db, phase1Result)

    const errorListRecords = await db<ErrorListRecord[]>`
      SELECT * FROM br7own.error_list`

    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_count).toBe(2)

    const insertedTriggers = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_triggers`

    expect(insertedTriggers).toHaveLength(1)
    expect(insertedTriggers[0].trigger_code).toEqual(phase1Result.triggers[0].code)

    const insertedNotes = await db<ErrorListTriggerRecord[]>`
      SELECT * FROM br7own.error_list_notes`

    expect(insertedNotes).toHaveLength(5)
    expect(insertedNotes[0]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[1]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[2]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[3]).toMatchSnapshot(snapshotExclusions)
    expect(insertedNotes[4]).toMatchSnapshot(snapshotExclusions)
  })
})
