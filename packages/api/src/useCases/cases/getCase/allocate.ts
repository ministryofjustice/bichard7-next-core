import type { AllocationQuery } from "@moj-bichard7/common/contracts/AllocationQuery"
import type { User, UserList } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchUserById from "../../../services/db/users/fetchUserById"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import { lockAndAuditLog } from "./lockAndAuditLog"

const allocate = async (
  auditLogGateway: AuditLogDynamoGateway,
  database: WritableDatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  query: AllocationQuery,
  caseId: number
): PromiseResult<UserList> => {
  if (!userAccess(user)[Permission.CanAllocate]) {
    return new NotAllowedError()
  }

  const userBeingAllocated = await fetchUserById(database, user, query.allocatedToUserId)

  const lockAndFetchCaseResult = await lockAndAuditLog(
    database,
    auditLogGateway,
    userBeingAllocated as User,
    caseId,
    logger,
    "both"
  )

  /* if (isError(result)) {
    logger.error(result)
    return result
  } */

  /*   const usersDto = users.users.map((u) => convertUserToDto(u))
   */
  return { users: [] }
}

export default allocate
