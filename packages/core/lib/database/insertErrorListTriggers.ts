import type { Sql } from "postgres"

import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

import ResolutionStatus from "../../types/ResolutionStatus"

const insertErrorListTriggers = async (db: Sql, recordId: number, triggers: Trigger[]): Promise<void> => {
  for (const trigger of triggers) {
    const triggerRecord: ErrorListTriggerRecord = {
      error_id: recordId,
      trigger_code: trigger.code,
      status: ResolutionStatus.UNRESOLVED,
      create_ts: new Date(),
      trigger_item_identity: trigger.offenceSequenceNumber?.toString() ?? null
    }

    await db`INSERT INTO br7own.error_list_triggers ${db(triggerRecord)}`
  }
}

export default insertErrorListTriggers
