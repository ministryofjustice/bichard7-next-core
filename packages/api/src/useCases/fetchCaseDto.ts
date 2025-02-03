import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type { AuditLogDynamoGateway } from "../services/gateways/dynamo"
import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import { lockCase } from "./cases/lock"
import { convertCaseToCaseDto } from "./dto/convertCaseToDto"

const fetchCaseDTO = async (
  user: User,
  dataStore: DataStoreGateway,
  caseId: number,
  auditLogGateway: AuditLogDynamoGateway,
  logger: FastifyBaseLogger
): Promise<CaseDto> => {
  if (dataStore.forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  const caseDataForDto = await lockCase(dataStore, auditLogGateway, caseId, user.username, logger)

  return convertCaseToCaseDto(caseDataForDto, user, logger)
}

export default fetchCaseDTO
