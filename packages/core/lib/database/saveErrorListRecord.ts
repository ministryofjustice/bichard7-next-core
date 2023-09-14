import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"
import type { PersistablePhase1Result } from "../../phase1/types/Phase1Result"
import fetchErrorListRecordId from "./fetchErrorListRecordId"
import generateExceptionsNoteText from "./generateExceptionsNoteText"
import generateTriggersNoteText, { TriggerCreationType } from "./generateTriggersNoteText"
import { default as insertErrorListNotes } from "./insertErrorListNotes"
import insertErrorListRecord from "./insertErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"
import updateErrorListRecord from "./updateErrorListRecord"
import updateErrorListTriggers from "./updateErrorListTriggers"

const handleUpdate = async (db: Sql, recordId: number, result: PersistablePhase1Result): Promise<void> => {
  if (result.hearingOutcome.Exceptions.length > 0) {
    await updateErrorListRecord(db, recordId, result)
  }
  const triggerChanges = await updateErrorListTriggers(db, recordId, result)
  const notes = [
    generateTriggersNoteText(triggerChanges.added, TriggerCreationType.ADD),
    generateTriggersNoteText(triggerChanges.deleted, TriggerCreationType.DELETE),
    generateExceptionsNoteText(result.hearingOutcome.Exceptions)
  ]
  await insertErrorListNotes(db, recordId, notes)
}

const handleInsert = async (db: Sql, result: PersistablePhase1Result): Promise<void> => {
  const newRecordId = await insertErrorListRecord(db, result)
  await insertErrorListTriggers(db, newRecordId, result.triggers)
  const notes = [
    generateTriggersNoteText(result.triggers),
    generateExceptionsNoteText(result.hearingOutcome.Exceptions)
  ]
  await insertErrorListNotes(db, newRecordId, notes)
}

const saveErrorListRecord = (db: Sql, result: PersistablePhase1Result): PromiseResult<void> => {
  return db
    .begin(async () => {
      const recordId = await fetchErrorListRecordId(db, result.correlationId)
      if (recordId !== undefined) {
        await handleUpdate(db, recordId, result)
      } else {
        await handleInsert(db, result)
      }
    })
    .catch((e) => e)
}

export default saveErrorListRecord
