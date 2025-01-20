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

  await db.lockCase(LockReason.Exception, caseId, user.username, forceIds)
  const caseDataForDto = await db.fetchCase(caseId, forceIds)

  return convertCaseToCaseDto(caseDataForDto, user, logger)
}

export default fetchCaseDTO
