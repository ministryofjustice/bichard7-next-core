import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type ResolutionStatus from "./ResolutionStatus"

export enum QualityCheckStatus {
  UNCHECKED = 1
}

type ErrorListRecord = {
  annotated_msg: string
  asn?: string
  court_code?: string
  court_date?: Date
  court_name?: string
  court_name_upper?: string
  court_reference: string
  court_room?: string
  create_ts: Date
  defendant_name?: string
  defendant_name_upper?: string
  error_count: number
  error_id?: number
  error_insert_ts?: Date
  error_locked_by_id?: string
  error_quality_checked?: null | QualityCheckStatus
  error_reason?: null | string
  error_report: string
  error_resolved_by?: null | string
  error_resolved_ts?: Date | null
  error_status?: null | ResolutionStatus
  hearing_outcome?: AnnotatedHearingOutcome | PncUpdateDataset
  is_urgent: number
  last_pnc_failure_resubmission_ts?: Date
  message_id: string
  msg_received_ts: Date
  org_for_police_filter?: string
  phase: number
  pnc_update_enabled?: "N" | "Y"
  ptiurn?: string
  resolution_ts?: Date
  total_pnc_failure_resubmissions?: number
  trigger_count: number
  trigger_insert_ts?: Date
  trigger_locked_by_id?: string
  trigger_quality_checked?: null | QualityCheckStatus
  trigger_reason?: null | string
  trigger_resolved_by?: null | string
  trigger_resolved_ts?: Date
  trigger_status?: null | ResolutionStatus
  updated_hearing_outcome?: AnnotatedHearingOutcome | PncUpdateDataset
  updated_msg?: string
  user_updated_flag: number
}

export default ErrorListRecord
