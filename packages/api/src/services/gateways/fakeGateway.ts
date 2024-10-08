/* eslint-disable @typescript-eslint/no-unused-vars */
import type Gateway from "@/services/gateways/interfaces/gateway"
import type { User } from "@moj-bichard7/common/types/User"

class FakeGateway implements Gateway {
  async fetchUserByUsername(username: string): Promise<User> {
    return Promise.resolve({ id: 1, username, jwt_id: "123", groups: [], visible_forces: "" } satisfies User)
  }

  async filterUserHasSameForceAsCaseAndLockedByUser(
    _username: string,
    _caseId: number,
    _forceIds: number[]
  ): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export default FakeGateway
