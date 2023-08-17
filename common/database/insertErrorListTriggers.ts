import ResolutionStatus from "core/common/types/ResolutionStatus"
import type ErrorListTriggerRecord from "core/phase1/types/ErrorListTriggerRecord"
import type { Trigger } from "core/phase1/types/Trigger"
import type { Sql } from "postgres"

const insertErrorListTriggers = async (db: Sql, recordId: number, triggers: Trigger[]): Promise<void> => {
  for (const trigger of triggers) {
    const triggerRecord: ErrorListTriggerRecord = {
      error_id: recordId,
      trigger_code: trigger.code,
      status: ResolutionStatus.UNRESOLVED,
      create_ts: new Date()
    }
    if (trigger.offenceSequenceNumber) {
      triggerRecord.trigger_item_identity = String(trigger.offenceSequenceNumber)
    }
    await db`INSERT INTO br7own.error_list_triggers ${db(triggerRecord)}`
  }
}

export default insertErrorListTriggers
