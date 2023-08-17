import type ErrorListRecord from "core/phase1/types/ErrorListRecord"
import type { Phase1SuccessResult } from "core/phase1/types/Phase1Result"
import ResolutionStatus from "core/phase1/types/ResolutionStatus"
import type { PostgresError, Sql } from "postgres"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"

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
    user_updated_flag: record.user_updated_flag
  }
}

const updateErrorListRecord = async (db: Sql, recordId: number, result: Phase1SuccessResult): Promise<void> => {
  try {
    const updateFields = generateUpdateFields(result)
    const updateResult = await db<ErrorListRecord[]>`
      UPDATE br7own.error_list SET ${db(updateFields)} WHERE error_id = ${recordId}`
    if (updateResult.count !== 1) {
      throw new Error("Error updating error_list table - no rows updated")
    }
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(e)
      throw error
    }
  }
}

export default updateErrorListRecord
