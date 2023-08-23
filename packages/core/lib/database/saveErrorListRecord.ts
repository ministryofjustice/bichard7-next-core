import type { PromiseResult } from "@moj-bichard7/core/phase1/comparison/types/Result"
import type { Phase1SuccessResult } from "@moj-bichard7/core/phase1/types/Phase1Result"
import type { Sql } from "postgres"
import fetchErrorListRecordId from "lib/database/fetchErrorListRecordId"
import generateExceptionsNoteText from "lib/database/generateExceptionsNoteText"
import generateTriggersNoteText, { TriggerCreationType } from "lib/database/generateTriggersNoteText"
import { default as insertErrorListNotes } from "lib/database/insertErrorListNotes"
import insertErrorListRecord from "lib/database/insertErrorListRecord"
import insertErrorListTriggers from "lib/database/insertErrorListTriggers"
import updateErrorListRecord from "lib/database/updateErrorListRecord"
import updateErrorListTriggers from "lib/database/updateErrorListTriggers"

const handleUpdate = async (db: Sql, recordId: number, result: Phase1SuccessResult): Promise<void> => {
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

const handleInsert = async (db: Sql, result: Phase1SuccessResult): Promise<void> => {
  const newRecordId = await insertErrorListRecord(db, result)
  await insertErrorListTriggers(db, newRecordId, result.triggers)
  const notes = [
    generateTriggersNoteText(result.triggers),
    generateExceptionsNoteText(result.hearingOutcome.Exceptions)
  ]
  await insertErrorListNotes(db, newRecordId, notes)
}

const saveErrorListRecord = (db: Sql, result: Phase1SuccessResult): PromiseResult<void> => {
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
