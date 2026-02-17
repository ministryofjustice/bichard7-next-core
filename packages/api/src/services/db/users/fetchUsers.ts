import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export type FetchUsersResult = {
  users: User[]
}

export default (_database: DatabaseConnection, _user: User): PromiseResult<FetchUsersResult> => {
  return Promise.resolve({ users: [] })
}
