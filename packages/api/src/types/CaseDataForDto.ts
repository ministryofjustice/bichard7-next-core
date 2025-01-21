import type { Case } from "@moj-bichard7/common/types/Case"

export type CaseDataForDto = Pick<Case, CaseData> & {
  error_locked_by_fullname: null | string
  trigger_locked_by_fullname: null | string
}

type CaseData =
  | "annotated_msg"
  | "asn"
  | "court_code"
  | "court_date"
  | "court_name"
  | "court_reference"
  | "defendant_name"
  | "error_id"
  | "error_locked_by_id"
  | "error_report"
  | "error_status"
  | "is_urgent"
  | "notes"
  | "org_for_police_filter"
  | "phase"
  | "ptiurn"
  | "resolution_ts"
  | "trigger_count"
  | "trigger_locked_by_id"
  | "trigger_status"
  | "triggers"
  | "updated_msg"
