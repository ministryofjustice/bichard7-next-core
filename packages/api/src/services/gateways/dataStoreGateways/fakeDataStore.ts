import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

class FakeDataStore implements DataStoreGateway {
  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
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
