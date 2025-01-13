import type { CaseDB } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

import dummyAho from "../../../tests/fixtures/AnnotatedHO1.json"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  async fetchFullCase(_caseId: number, _forceIds: number[]): Promise<CaseDB> {
    return Promise.resolve({
      annotated_msg: dummyAho.hearingOutcomeXml,
      asn: "",
      court_code: "",
      court_date: new Date("2022-06-30"),
      court_name: "",
      court_name_upper: "",
      court_reference: "",
      court_room: "",
      create_ts: new Date("2022-06-30T08:44:03.930Z"),
      defendant_name: "",
      defendant_name_upper: "",
      error_count: 0,
      error_id: 0,
      error_insert_ts: null,
      error_locked_by_id: null,
      error_quality_checked: null,
      error_reason: null,
      error_report: "",
      error_resolved_by: null,
      error_resolved_ts: null,
      error_status: null,
      is_urgent: 0,
      last_pnc_failure_resubmission_ts: null,
      message_id: "",
      msg_received_ts: new Date("2022-06-30T08:44:03.930Z"),
      org_for_police_filter: "",
      phase: 1,
      pnc_update_enabled: null,
      ptiurn: null,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      trigger_insert_ts: null,
      trigger_locked_by_id: null,
      trigger_quality_checked: null,
      trigger_reason: null,
      trigger_resolved_by: null,
      trigger_resolved_ts: null,
      trigger_status: null,
      updated_msg: null,
      user_updated_flag: 1
    } satisfies CaseDB)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return Promise.resolve({
      email: "user1@example.com",
      groups: [],
      id: 1,
      jwt_id: "123",
      username,
      visible_forces: ""
    } satisfies User)
  }
}

export default FakeDataStore
