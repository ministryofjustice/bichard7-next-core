import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUsers from "../../services/db/users/fetchUsers"
import { convertUserToDto } from "../dto/convertUserToDto"

const fetchUserList = async (
  database: DatabaseConnection,
  user: User,
  logger: FastifyBaseLogger
): PromiseResult<UserList> => {
  const users = await fetchUsers(database, user)

  if (isError(users)) {
    logger.error(users)
    throw users
  }

  const usersDto = users.users.map((u) => convertUserToDto(u))

  return { users: usersDto }
}

export default fetchUserList
