import type { RawCaseData } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  async fetchFullCase(_caseId: number, _forceIds: number[]): Promise<RawCaseData> {
    return Promise.resolve({
      annotated_msg: "",
      asn: "",
      court_code: "",
      court_date: new Date("2022-06-30"),
      court_name: "",
      court_reference: "",
      defendant_name: "",
      error_id: 0,
      error_locked_by_fullname: "",
      error_locked_by_id: null,
      error_report: "",
      error_status: null,
      is_urgent: 0,
      org_for_police_filter: "",
      phase: 1,
      ptiurn: null,
      resolution_ts: null,
      trigger_count: 0,
      trigger_locked_by_fullname: "",
      trigger_locked_by_id: null,
      trigger_status: null,
      updated_msg: ""
    } satisfies RawCaseData)
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
