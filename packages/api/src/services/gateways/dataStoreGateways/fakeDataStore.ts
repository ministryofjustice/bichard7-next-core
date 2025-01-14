import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

import dummyAho from "../../../tests/fixtures/AnnotatedHO1.json"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  async fetchFullCase(_caseId: number, _forceIds: number[]): Promise<Case> {
    return Promise.resolve({
      annotated_msg: dummyAho.hearingOutcomeXml,
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
      updated_msg: null
    } satisfies Case)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return Promise.resolve({
      email: "user1@example.com",
      forenames: null,
      groups: [],
      id: 1,
      jwt_id: "123",
      surname: null,
      username,
      visible_forces: ""
    } satisfies User)
  }
}

export default FakeDataStore
