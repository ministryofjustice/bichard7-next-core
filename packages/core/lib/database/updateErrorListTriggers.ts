import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Sql } from "postgres"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"
import type PhaseResult from "../../types/PhaseResult"
import ResolutionStatus from "../../types/ResolutionStatus"
import type { Trigger } from "../../types/Trigger"
import insertErrorListTriggers from "./insertErrorListTriggers"

type TriggerUpdates = {
  added: Trigger[]
  deleted: Trigger[]
}

const sanitiseTriggerItemIdentity = (value: null | string | undefined): number | undefined => {
  if (!value) {
    return undefined
  }

  return Number(value)
}

const triggerMatches = (trigger: Trigger, dbTrigger: ErrorListTriggerRecord): boolean =>
  trigger.code === dbTrigger.trigger_code &&
  trigger.offenceSequenceNumber === sanitiseTriggerItemIdentity(dbTrigger.trigger_item_identity)

const updateErrorListTriggers = async (db: Sql, recordId: number, result: PhaseResult): Promise<TriggerUpdates> => {
  const existingTriggers = await db<ErrorListTriggerRecord[]>`
    SELECT * FROM br7own.error_list_triggers WHERE error_id = ${recordId}`

  const newTriggers = result.triggers.filter(
    (newTrigger) => !existingTriggers.some((existingTrigger) => triggerMatches(newTrigger, existingTrigger))
  )

  const deletedTriggers = existingTriggers
    .filter((existingTrigger) => !result.triggers.some((newTrigger) => triggerMatches(newTrigger, existingTrigger)))
    .filter((trigger) => trigger.status === ResolutionStatus.UNRESOLVED)

  const deletedTriggerIds = deletedTriggers.map((t) => t.trigger_id!)

  await db`DELETE FROM br7own.error_list_triggers WHERE trigger_id IN ${db(deletedTriggerIds)}`

  await insertErrorListTriggers(db, recordId, newTriggers)

  return {
    added: newTriggers,
    deleted: deletedTriggers.map((t) => ({
      code: t.trigger_code as TriggerCode,
      offenceSequenceNumber: Number(t.trigger_item_identity)
    }))
  }
}

export default updateErrorListTriggers
