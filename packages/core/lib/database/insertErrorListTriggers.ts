import type { Sql } from "postgres"

import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

import ResolutionStatus from "../../types/ResolutionStatus"

const insertErrorListTriggers = async (db: Sql, recordId: number, triggers: Trigger[]): Promise<void> => {
  for (const trigger of triggers) {
    const triggerRecord: ErrorListTriggerRecord = {
      create_ts: new Date(),
      error_id: recordId,
      status: ResolutionStatus.UNRESOLVED,
      trigger_code: trigger.code
    }
    if (trigger.offenceSequenceNumber) {
      triggerRecord.trigger_item_identity = String(trigger.offenceSequenceNumber)
    }

    await db`INSERT INTO br7own.error_list_triggers ${db(triggerRecord)}`
  }
}

export default insertErrorListTriggers
