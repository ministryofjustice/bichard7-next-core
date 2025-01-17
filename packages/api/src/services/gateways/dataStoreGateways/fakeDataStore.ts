import type { PartialCaseRow } from "@moj-bichard7/common/types/Case"
import type { FullUserRow } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

import dummyAho from "../../../tests/fixtures/AnnotatedHO1.json"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  async fetchCase(_caseId: number, _forceIds: number[]): Promise<PartialCaseRow> {
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
      notes: [],
      org_for_police_filter: "",
      phase: 1,
      ptiurn: null,
      resolution_ts: null,
      trigger_count: 0,
      trigger_locked_by_fullname: "",
      trigger_locked_by_id: null,
      trigger_status: null,
      triggers: [],
      updated_msg: null
    } satisfies PartialCaseRow)
  }

  async fetchUserByUsername(username: string): Promise<FullUserRow> {
    return Promise.resolve({
      email: "user1@example.com",
      excluded_triggers: null,
      feature_flags: {},
      forenames: null,
      groups: [],
      id: 1,
      jwt_id: "123",
      surname: null,
      username,
      visible_courts: null,
      visible_forces: ""
    } satisfies FullUserRow)
  }
}

export default FakeDataStore
