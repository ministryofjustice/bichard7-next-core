import type { AllocationQuery } from "@moj-bichard7/common/contracts/AllocationQuery"
import type { User, UserList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotAllowedError } from "../../../types/errors/NotAllowedError"

const allocate = async (
  database: DatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  query: AllocationQuery,
  caseId: number
): PromiseResult<UserList> => {
  if (!userAccess(user)[Permission.CanAllocate]) {
    return new NotAllowedError()
  }

  if (query.caseType === "triggers") {
  }

  if (query.caseType === "exceptions") {
    //await lockExceptions(database.connection, user, caseId, [], "Bichard New UI - Allocation")
  }

  /* if (isError(result)) {
    logger.error(result)
    return result
  } */

  /*   const usersDto = users.users.map((u) => convertUserToDto(u))
   */
  return { users: [] }
}

export default allocate
