import type { ApiUserLookupQuery } from "@moj-bichard7/common/contracts/ApiUserLookupQuery"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { type User, type UserLookupList, UserLookupRowSchema } from "@moj-bichard7/common/types/User"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import z from "zod"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUserLookups from "../../services/db/users/fetchUserLookups"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { convertUserLookupToUserLookupDto } from "../dto/convertUserToDto"

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

  const parsedResults = z.array(UserLookupRowSchema).safeParse(users.users)
  if (!parsedResults.success) {
    return parsedResults.error
  }

  const usersDto = parsedResults.data.map((u) => convertUserLookupToUserLookupDto(u))

  return { users: usersDto }
}

export default fetchUserLookupList
