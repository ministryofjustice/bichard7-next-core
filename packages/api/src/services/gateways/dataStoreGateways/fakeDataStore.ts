import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  async fetchFullCase(_caseId: number, _forceIds: number[]): Promise<Case> {
    return Promise.resolve({
      annotated_msg: "",
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
      user_updated_flag: 0
    } satisfies Case)
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
