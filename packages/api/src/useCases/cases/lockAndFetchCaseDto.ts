import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import { lockAndAuditLog } from "./lockAndAuditLog"

const lockAndFetchCaseDto = async (
  database: WritableDatabaseConnection,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  caseId: number,
  logger: FastifyBaseLogger
): PromiseResult<CaseDto> => {
  const lockAndFetchCaseResult = await lockAndAuditLog(database, auditLogGateway, user, caseId, logger)
  if (isError(lockAndFetchCaseResult)) {
    return lockAndFetchCaseResult
  }

  return fetchCase(database, user, caseId, logger)
}

export default lockAndFetchCaseDto
