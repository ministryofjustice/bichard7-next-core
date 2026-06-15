import type { ApiUserLookupQuery } from "@moj-bichard7/common/contracts/ApiUserLookupQuery"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserLookupList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUserLookups from "../../services/db/users/fetchUserLookups"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { convertUserToLookupDto } from "../dto/convertUserToDto"

const fetchUserLookupList = async (
  database: DatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  query?: ApiUserLookupQuery
): PromiseResult<UserLookupList> => {
  if (!userAccess(user)[Permission.CanListUsers]) {
    return new NotAllowedError()
  }

  const users = await fetchUserLookups(database, user, query?.usernameOrName)

  if (isError(users)) {
    logger.error(users)
    return users
  }

  const usersDto = users.users.map((u) => convertUserToLookupDto(u))

  return { users: usersDto }
}

export default fetchUserLookupList
