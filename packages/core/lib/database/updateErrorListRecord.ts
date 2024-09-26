import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type PhaseResult from "../../types/PhaseResult"
import { getAnnotatedHearingOutcome } from "../../types/PhaseResult"
import ResolutionStatus from "../../types/ResolutionStatus"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"

const generateUpdateFields = (result: PhaseResult): Partial<ErrorListRecord> => {
  const record = convertResultToErrorListRecord(result)
  const fields: Partial<ErrorListRecord> = {
    phase: record.phase,
    asn: record.asn,
    ptiurn: record.ptiurn,
    org_for_police_filter: record.org_for_police_filter,
    annotated_msg: record.annotated_msg,
    updated_msg: record.updated_msg,
    user_updated_flag: record.user_updated_flag
  }

  const hearingOutcome = getAnnotatedHearingOutcome(result)
  if (hearingOutcome.Exceptions.length > 0) {
    fields.error_quality_checked = record.error_quality_checked
    fields.error_report = record.error_report
    fields.error_reason = record.error_reason
    fields.error_count = record.error_count
  }

  return fields
}

const updateErrorListRecord = async (db: Sql, recordId: number, result: PhaseResult): Promise<void> => {
  try {
    const updateFields = generateUpdateFields(result)
    const exceptionsCount = getAnnotatedHearingOutcome(result).Exceptions.length

    const updateResult = await db<ErrorListRecord[]>`
      UPDATE br7own.error_list SET ${db(updateFields)},
        trigger_status = CASE
          WHEN (SELECT COUNT(*) FROM br7own.error_list_triggers WHERE error_id = ${recordId} AND status <> ${
            ResolutionStatus.RESOLVED
          }::integer) > 0 THEN ${ResolutionStatus.UNRESOLVED}::integer
          WHEN trigger_status IS NULL THEN NULL
          ELSE ${ResolutionStatus.RESOLVED}::integer
        END,
        trigger_count = (SELECT COUNT(*) FROM br7own.error_list_triggers WHERE error_id = ${recordId}),
        trigger_reason = (SELECT trigger_code FROM br7own.error_list_triggers WHERE error_id = ${recordId} LIMIT 1),
        error_status = CASE
          WHEN ${exceptionsCount}::integer > 0 THEN ${ResolutionStatus.UNRESOLVED}::integer
          WHEN error_status IS NULL THEN NULL
          ELSE ${ResolutionStatus.RESOLVED}::integer
        END
      WHERE error_id = ${recordId}`

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
