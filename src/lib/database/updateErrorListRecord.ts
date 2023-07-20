import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "src/types/ErrorListTriggerRecord"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import ResolutionStatus from "src/types/ResolutionStatus"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"

const generateUpdateFields = (result: Phase1SuccessResult): Partial<ErrorListRecord> => {
  const record = convertResultToErrorListRecord(result)
  return {
    asn: record.asn,
    ptiurn: record.ptiurn,
    org_for_police_filter: record.org_for_police_filter,
    error_count: record.error_count,
    error_report: record.error_report,
    error_reason: record.error_reason,
    error_quality_checked: record.error_quality_checked,
    annotated_msg: record.annotated_msg,
    updated_msg: record.updated_msg,
    error_status: ResolutionStatus.UNRESOLVED,
    error_resolved_by: null,
    error_resolved_ts: null,
    user_updated_flag: record.user_updated_flag,
    error_insert_ts: record.error_insert_ts
  }
}

const updateErrorListTriggers = async (db: Sql, recordId: number, result: Phase1SuccessResult): Promise<void> => {
  const existingTriggers = await db<ErrorListTriggerRecord[]>`
    SELECT * FROM br7own.error_list_triggers WHERE error_id = ${result.correlationId}`

  const newTriggers = result.triggers.filter((trigger) =>
    existingTriggers.some(
      (existingTrigger) =>
        trigger.code === existingTrigger.trigger_code &&
        trigger.offenceSequenceNumber === existingTrigger.trigger_item_identity
    )
  )

  return insertErrorListTriggers(db, recordId, newTriggers)
}

const updateErrorListRecord = async (db: Sql, recordId: number, result: Phase1SuccessResult): Promise<number> => {
  let updateId: number | undefined
  try {
    const updateFields = generateUpdateFields(result)
    const updateResult = await db<ErrorListRecord[]>`
      UPDATE br7own.error_list SET ${db(updateFields)} WHERE error_id = ${recordId}`

    await updateErrorListTriggers(db, recordId, result)
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(e)
      throw error
    }
  }
  if (!updateId) {
    throw new Error("Error updating error_list table")
  }
  return updateId
}

export default updateErrorListRecord
