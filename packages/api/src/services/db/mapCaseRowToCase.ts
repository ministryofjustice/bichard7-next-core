import type { Case, CaseRow } from "@moj-bichard7/common/types/Case"

import formatForceNumbers from "../formatForceNumbers"
import mapNoteRowToNote from "./mapNoteRowToNote"
import mapTriggerRowToTrigger from "./mapTriggerRowToTrigger"

const mapCaseRowToCase = (caseRow: CaseRow): Case => ({
  aho: caseRow.annotated_msg,
  asn: caseRow.asn,
  courtCode: caseRow.court_code,
  courtDate: caseRow.court_date,
  courtName: caseRow.court_name,
  courtNameUpper: caseRow.court_name_upper,
  courtReference: caseRow.court_reference,
  courtRoom: caseRow.court_room,
  createdAt: caseRow.create_ts,
  defendantName: caseRow.defendant_name,
  defendantNameUpper: caseRow.defendant_name_upper,
  errorCount: caseRow.error_count,
  errorId: caseRow.error_id,
  errorInsertedAt: caseRow.error_insert_ts,
  errorLockedById: caseRow.error_locked_by_id,
  errorQualityChecked: caseRow.error_quality_checked,
  errorReason: caseRow.error_reason,
  errorReport: caseRow.error_report,
  errorResolvedAt: caseRow.error_resolved_ts,
  errorResolvedBy: caseRow.error_resolved_by,
  errorStatus: caseRow.error_status,
  isUrgent: caseRow.is_urgent,
  lastPncFailureResubmissionAt: caseRow.last_pnc_failure_resubmission_ts,
  messageId: caseRow.message_id,
  messageReceivedAt: caseRow.msg_received_ts,
  notes: caseRow.notes?.map(mapNoteRowToNote) ?? [],
  orgForPoliceFilter: formatForceNumbers(caseRow.org_for_police_filter),
  phase: caseRow.phase,
  pncUpdateEnabled: caseRow.pnc_update_enabled,
  ptiurn: caseRow.ptiurn,
  resolutionAt: caseRow.resolution_ts,
  totalPncFailureResubmissions: caseRow.total_pnc_failure_resubmissions,
  triggerCount: caseRow.trigger_count,
  triggerInsertedAt: caseRow.trigger_insert_ts,
  triggerLockedById: caseRow.trigger_locked_by_id,
  triggerQualityChecked: caseRow.trigger_quality_checked,
  triggerReason: caseRow.trigger_reason,
  triggerResolvedAt: caseRow.trigger_resolved_ts,
  triggerResolvedBy: caseRow.trigger_resolved_by,
  triggers: caseRow.triggers?.map(mapTriggerRowToTrigger) ?? [],
  triggerStatus: caseRow.trigger_status,
  updatedAho: caseRow.updated_msg,
  userUpdatedFlag: caseRow.user_updated_flag
})

export default mapCaseRowToCase
