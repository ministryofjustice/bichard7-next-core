import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUsers from "../../services/db/users/fetchUsers"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { convertUserToDto } from "../dto/convertUserToDto"

const fetchUserList = async (
  database: DatabaseConnection,
  user: User,
  logger: FastifyBaseLogger
): PromiseResult<UserList> => {
  if (!userAccess(user)[Permission.CanListUsers]) {
    return new NotAllowedError()
  }

  const users = await fetchUsers(database, user)

  if (isError(users)) {
    logger.error(users)
    throw users
  }

  const usersDto = users.users.map((u) => convertUserToDto(u))

  return { users: usersDto }
}

export default fetchUserList
