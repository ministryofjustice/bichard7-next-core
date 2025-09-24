import type { Case, CaseRow } from "@moj-bichard7/common/types/Case"

export type CaseData =
  | "aho"
  | "courtCode"
  | "courtReference"
  | "isUrgent"
  | "orgForPoliceFilter"
  | "phase"
  | "updatedAho"
  | CaseDataIndex

export type CaseDataForDto = FullnameFields & Pick<Case, CaseData>

export type CaseDataForIndexDto = FullnameFields &
  Pick<Case, CaseDataIndex> & {
    fullCount: number
    noteCount: number
  }
export type CaseDataRow =
  | "annotated_msg"
  | "court_code"
  | "court_reference"
  | "is_urgent"
  | "org_for_police_filter"
  | "phase"
  | "updated_msg"
  | CaseDataIndexRow

export type CaseMessageId = Pick<CaseRow, "message_id">

export type CaseRowForDto = FullnameFieldsRow & Pick<CaseRow, CaseDataRow>

export type CaseRowForIndexDto = FullnameFieldsRow &
  Pick<CaseRow, CaseDataIndexRow> & {
    full_count: number
    note_count: number
  }

type CaseDataIndex =
  | "asn"
  | "courtDate"
  | "courtName"
  | "defendantName"
  | "errorId"
  | "errorLockedById"
  | "errorReport"
  | "errorStatus"
  | "isUrgent"
  | "notes"
  | "ptiurn"
  | "resolutionAt"
  | "triggerCount"
  | "triggerLockedById"
  | "triggers"
  | "triggerStatus"

type CaseDataIndexRow =
  | "asn"
  | "court_date"
  | "court_name"
  | "defendant_name"
  | "error_id"
  | "error_locked_by_id"
  | "error_quality_checked"
  | "error_report"
  | "error_status"
  | "is_urgent"
  | "msg_received_ts"
  | "notes"
  | "ptiurn"
  | "resolution_ts"
  | "trigger_count"
  | "trigger_locked_by_id"
  | "trigger_quality_checked"
  | "trigger_status"
  | "triggers"

type FullnameFields = {
  errorLockedByFullname: null | string
  triggerLockedByFullname: null | string
}

type FullnameFieldsRow = {
  error_locked_by_fullname: null | string
  trigger_locked_by_fullname: null | string
}
