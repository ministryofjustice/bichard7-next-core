import type ResolutionStatus from "./ResolutionStatus"

export enum QualityCheckStatus {
  UNCHECKED = 1
}

type ErrorListRecord = {
  error_id?: number
  message_id: string
  phase: number
  error_status?: ResolutionStatus | null
  trigger_status?: ResolutionStatus | null
  error_quality_checked?: QualityCheckStatus | null
  trigger_quality_checked?: QualityCheckStatus | null
  trigger_count: number
  error_locked_by_id?: string
  trigger_locked_by_id?: string
  is_urgent: number
  asn?: string
  court_code?: string
  annotated_msg: string
  updated_msg?: string
  error_report: string
  create_ts: Date
  error_reason?: string | null
  trigger_reason?: string | null
  error_count: number
  user_updated_flag: number
  court_date?: Date
  ptiurn?: string
  court_name?: string
  resolution_ts?: Date
  msg_received_ts: Date
  error_resolved_by?: string | null
  trigger_resolved_by?: string | null
  error_resolved_ts?: Date | null
  trigger_resolved_ts?: Date
  defendant_name?: string
  org_for_police_filter?: string
  court_room?: string
  court_reference: string
  error_insert_ts?: Date
  trigger_insert_ts?: Date
  pnc_update_enabled?: "Y" | "N"
  defendant_name_upper?: string
  court_name_upper?: string
  last_pnc_failure_resubmission_ts?: Date
  total_pnc_failure_resubmissions?: number
}

export default ErrorListRecord
