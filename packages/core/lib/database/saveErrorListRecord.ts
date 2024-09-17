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
  const notes: (null | string)[] = []

  const isPhase2 = "triggerGenerationAttempted" in result
  if (!isPhase2 || result.triggerGenerationAttempted === true) {
    const triggerChanges = await updateErrorListTriggers(db, recordId, result)
    notes.push(generateTriggersNoteText(triggerChanges.added, TriggerCreationType.ADD))
    notes.push(generateTriggersNoteText(triggerChanges.deleted, TriggerCreationType.DELETE))
  }

  await updateErrorListRecord(db, recordId, result)

  notes.push(generateExceptionsNoteText(aho.Exceptions))
  await insertErrorListNotes(db, recordId, notes)
}

const handleInsert = async (db: Sql, result: PhaseResult): Promise<void> => {
  const aho = getAnnotatedHearingOutcome(result)
  const newRecordId = await insertErrorListRecord(db, result)
  await insertErrorListTriggers(db, newRecordId, result.triggers)
  const notes = [generateTriggersNoteText(result.triggers), generateExceptionsNoteText(aho.Exceptions)]
  await insertErrorListNotes(db, newRecordId, notes)
}

const shouldInsertRecord = (result: PhaseResult) =>
  result.triggers.length > 0 || getAnnotatedHearingOutcome(result).Exceptions.length > 0

const saveErrorListRecord = (db: Sql, result: PhaseResult): PromiseResult<void> => {
  return db
    .begin(async () => {
      const recordId = await fetchErrorListRecordId(db, result.correlationId)
      if (recordId !== undefined) {
        await handleUpdate(db, recordId, result)
      } else if (shouldInsertRecord(result)) {
        await handleInsert(db, result)
      }
    })
    .catch((e) => e)
}

export default saveErrorListRecord
