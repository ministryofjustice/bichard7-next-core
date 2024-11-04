/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from "@moj-bichard7/common/types/User"
import type DataStoreGateway from "../interfaces/dataStoreGateway"

class FakeDataStore implements DataStoreGateway {
  async fetchUserByUsername(username: string): Promise<User> {
    return Promise.resolve({
      id: 1,
      username,
      jwt_id: "123",
      groups: [],
      visible_forces: "",
      email: "user1@example.com"
    } satisfies User)
  }

  async canCaseBeResubmitted(_username: string, _caseId: number, _forceIds: number[]): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export default FakeDataStore
