import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"
import { Phase2ResultType } from "../../phase2/types/Phase2Result"
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
  // If case is resubmitted to Phase 1 and case is ignored in Phase 2,
  // we should update the record to set the correct error_status
  if (aho.Exceptions.length > 0 || result.resultType === Phase2ResultType.ignored) {
    await updateErrorListRecord(db, recordId, result)
  }

  // If trigger generator is not called in Phase 2, we shouldn't update triggers
  if ("triggerGenerationAttempted" in result && result.triggerGenerationAttempted === false) {
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
