import type { Case, CaseRow } from "@moj-bichard7/common/types/Case"

import mapNoteToNoteRow from "./mapNoteToNoteRow"
import mapTriggerToTriggerRow from "./mapTriggerToTriggerRow"

const mapCaseToCaseRow = (caseObj: Case): CaseRow => ({
  annotated_msg: caseObj.aho,
  asn: caseObj.asn,
  court_code: caseObj.courtCode,
  court_date: caseObj.courtDate,
  court_name: caseObj.courtName,
  court_name_upper: caseObj.courtNameUpper,
  court_reference: caseObj.courtReference,
  court_room: caseObj.courtRoom,
  create_ts: caseObj.createdAt,
  defendant_name: caseObj.defendantName,
  defendant_name_upper: caseObj.defendantNameUpper,
  error_count: caseObj.errorCount,
  error_id: caseObj.errorId,
  error_insert_ts: caseObj.errorInsertedAt,
  error_locked_by_id: caseObj.errorLockedById,
  error_quality_checked: caseObj.errorQualityChecked,
  error_reason: caseObj.errorReason,
  error_report: caseObj.errorReport,
  error_resolved_by: caseObj.errorResolvedBy,
  error_resolved_ts: caseObj.errorResolvedAt,
  error_status: caseObj.errorStatus,
  is_urgent: caseObj.isUrgent,
  last_pnc_failure_resubmission_ts: caseObj.lastPncFailureResubmissionAt,
  message_id: caseObj.messageId,
  msg_received_ts: caseObj.messageReceivedAt,
  notes: caseObj.notes?.map(mapNoteToNoteRow) ?? [],
  org_for_police_filter: caseObj.orgForPoliceFilter,
  phase: caseObj.phase,
  pnc_update_enabled: caseObj.pncUpdateEnabled,
  ptiurn: caseObj.ptiurn,
  resolution_ts: caseObj.resolutionAt,
  total_pnc_failure_resubmissions: caseObj.totalPncFailureResubmissions,
  trigger_count: caseObj.triggerCount,
  trigger_insert_ts: caseObj.triggerInsertedAt,
  trigger_locked_by_id: caseObj.triggerLockedById,
  trigger_quality_checked: caseObj.triggerQualityChecked,
  trigger_reason: caseObj.triggerReason,
  trigger_resolved_by: caseObj.triggerResolvedBy,
  trigger_resolved_ts: caseObj.triggerResolvedAt,
  trigger_status: caseObj.triggerStatus,
  triggers: caseObj.triggers?.map(mapTriggerToTriggerRow) ?? [],
  updated_msg: caseObj.updatedAho,
  user_updated_flag: caseObj.userUpdatedFlag
})

export default mapCaseToCaseRow
