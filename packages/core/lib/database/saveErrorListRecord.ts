import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"
import type PhaseResult from "../../types/PhaseResult"
import { getAnnotatedHearingOutcome } from "../../types/PhaseResult"
import fetchErrorListRecordId from "./fetchErrorListRecordId"
import generateExceptionsNoteText from "./generateExceptionsNoteText"
import generateTriggersNoteText, { TriggerCreationType } from "./generateTriggersNoteText"
import { default as insertErrorListNotes } from "./insertErrorListNotes"
import insertErrorListRecord from "./insertErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"
import updateErrorListRecord from "./updateErrorListRecord"
import updateErrorListTriggers from "./updateErrorListTriggers"

const handleUpdate = async (db: Sql, recordId: number, result: PhaseResult): Promise<void> => {
  const aho = getAnnotatedHearingOutcome(result)
  if (aho.Exceptions.length > 0) {
    await updateErrorListRecord(db, recordId, result)
  }

  if ("triggersGenerated" in result && !result.triggersGenerated) {
    return
  }

  const triggerChanges = await updateErrorListTriggers(db, recordId, result)
  const notes = [
    generateTriggersNoteText(triggerChanges.added, TriggerCreationType.ADD),
    generateTriggersNoteText(triggerChanges.deleted, TriggerCreationType.DELETE),
    generateExceptionsNoteText(aho.Exceptions)
  ]
  await insertErrorListNotes(db, recordId, notes)
}

const handleInsert = async (db: Sql, result: PhaseResult): Promise<void> => {
  const aho = getAnnotatedHearingOutcome(result)
  const newRecordId = await insertErrorListRecord(db, result)
  await insertErrorListTriggers(db, newRecordId, result.triggers)
  const notes = [generateTriggersNoteText(result.triggers), generateExceptionsNoteText(aho.Exceptions)]
  await insertErrorListNotes(db, newRecordId, notes)
}

const saveErrorListRecord = (db: Sql, result: PhaseResult): PromiseResult<void> => {
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
