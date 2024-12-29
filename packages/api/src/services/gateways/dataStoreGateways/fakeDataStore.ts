import type { CaseDB } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  // TODO: Remove the `as unknown as CaseDB` replace it with `satisfies CaseDB`
  async fetchFullCase(_caseId: number, _forceIds: number[]): Promise<CaseDB> {
    return Promise.resolve({
      annotated_msg: "",
      asn: "",
      court_reference: "",
      create_ts: new Date("2022-06-30T08:44:03.930Z"),
      error_count: 1,
      error_id: 0,
      error_locked_by_id: null,
      error_report: "",
      error_status: 1,
      is_urgent: 0,
      message_id: "",
      msg_received_ts: new Date("2022-06-30T08:44:03.930Z"),
      org_for_police_filter: "",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      updated_msg: null,
      user_updated_flag: 0
    } as unknown as CaseDB)
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
