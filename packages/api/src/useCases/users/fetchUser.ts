import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUserById from "../../services/db/users/fetchUserById"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { convertUserToDto } from "../dto/convertUserToDto"

const fetchUser = async (
  database: DatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  userId: number
): PromiseResult<UserDto> => {
  if (!userAccess(user)[Permission.CanListUsers]) {
    return new NotAllowedError()
  }

  const result = await fetchUserById(database, user, userId)

  if (isError(result)) {
    logger.error(result)
    throw result
  }

  return convertUserToDto(result)
}

export default fetchUser
