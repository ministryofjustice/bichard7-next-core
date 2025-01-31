import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import { LockReason } from "../types/LockReason"
import { convertCaseToCaseDto } from "./dto/convertCaseToDto"

const fetchCaseDTO = async (
  user: User,
  dataStore: DataStoreGateway,
  caseId: number,
  logger: FastifyBaseLogger
): Promise<CaseDto> => {
  if (dataStore.forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  await dataStore.lockCase(LockReason.Exception, caseId, user.username)

  // TODO: Lock case if user can edit exceptions and audit log
  // TODO: Lock case if user can edit triggers and audit log
  const caseDataForDto = await dataStore.fetchCase(caseId)

  return convertCaseToCaseDto(caseDataForDto, user, logger)
}

export default fetchCaseDTO
