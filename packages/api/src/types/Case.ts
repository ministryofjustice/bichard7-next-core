import type { Case } from "@moj-bichard7/common/types/Case"

export type CaseData =
  | "annotated_msg"
  | "court_code"
  | "court_reference"
  | "is_urgent"
  | "org_for_police_filter"
  | "phase"
  | "updated_msg"
  | CaseDataIndex

export type CaseDataForDto = FullnameFields & Pick<Case, CaseData>

export type CaseDataForIndexDto = FullnameFields &
  Pick<Case, CaseDataIndex> & {
    full_count: number
    note_count: number
  }

export type CaseMessageId = Pick<Case, "message_id">

type CaseDataIndex =
  | "asn"
  | "court_date"
  | "court_name"
  | "defendant_name"
  | "error_id"
  | "error_locked_by_id"
  | "error_report"
  | "error_status"
  | "is_urgent"
  | "notes"
  | "ptiurn"
  | "resolution_ts"
  | "trigger_count"
  | "trigger_locked_by_id"
  | "trigger_status"
  | "triggers"

type FullnameFields = {
  error_locked_by_fullname: null | string
  trigger_locked_by_fullname: null | string
}
