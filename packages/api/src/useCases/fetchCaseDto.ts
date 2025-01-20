import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../services/formatForceNumbers"
import { LockReason } from "../types/LockReason"
import { convertCaseToCaseDto } from "./dto/convertCaseToDto"

const fetchCaseDTO = async (
  user: User,
  db: DataStoreGateway,
  caseId: number,
  logger: FastifyBaseLogger
): Promise<CaseDto> => {
  const forceIds = formatForceNumbers(user.visible_forces)

  if (forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  // TODO: Lock case if user can edit exceptions and audit log
  // TODO: Lock case if user can edit triggers and audit log
  const caseDataForDto = await db.fetchCase(caseId, forceIds)
  await db.lockCase(LockReason.Exception, caseDataForDto.error_id, user.username, forceIds)

  return convertCaseToCaseDto(caseDataForDto, user, logger)
}

export default fetchCaseDTO
