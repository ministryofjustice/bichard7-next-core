import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

const fetchUserList = async (
  _database: DatabaseConnection,
  _user: User,
  _logger: FastifyBaseLogger
): PromiseResult<UserList> => {
  return Promise.resolve({ users: [] })
}

export default fetchUserList
