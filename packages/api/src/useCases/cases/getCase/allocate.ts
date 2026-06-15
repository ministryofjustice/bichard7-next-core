import type { AllocationQuery } from "@moj-bichard7/common/contracts/AllocationQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
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
): PromiseResult<void> => {
  if (!userAccess(user)[Permission.CanAllocate] || !userAccess(user)[Permission.CanListUsers]) {
    return new NotAllowedError()
  }

  const userBeingAllocated = await fetchUserById(database, user, query.allocatedToUserId)

  if (isError(userBeingAllocated)) {
    logger.error(userBeingAllocated)
    return userBeingAllocated
  }

  const lockResult = await lockAndAuditLog(
    database,
    auditLogGateway,
    userBeingAllocated as unknown as User,
    caseId,
    logger,
    query.caseType
  )

  if (isError(lockResult)) {
    logger.error(lockResult)
    return lockResult
  }
}

export default allocate
