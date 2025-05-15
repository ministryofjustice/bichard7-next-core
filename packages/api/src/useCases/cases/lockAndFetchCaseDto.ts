import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import { convertCaseToCaseDto } from "../dto/convertCaseToDto"
import { lockAndAuditLog } from "./lockAndAuditLog"

const lockAndFetchCaseDto = async (
  database: WritableDatabaseConnection,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  caseId: number,
  logger: FastifyBaseLogger
): Promise<CaseDto> => {
  const lockAndFetchCaseResult = await lockAndAuditLog(database, auditLogGateway, user, caseId, logger)
  if (isError(lockAndFetchCaseResult)) {
    return lockAndFetchCaseResult
  }

  const courtCase = await fetchCase(database, user, caseId)
  if (isError(courtCase)) {
    return courtCase
  }

  return convertCaseToCaseDto(courtCase, user, logger)
}

export default lockAndFetchCaseDto
