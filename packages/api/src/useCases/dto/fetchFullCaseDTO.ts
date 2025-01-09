import type { CaseDTO } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../../services/formatForceNumbers"
import { convertCaseDBToCaseDTO } from "./convertCaseDBToDTO"

const fetchFullCaseDTO = async (
  user: User,
  db: DataStoreGateway,
  caseId: number,
  logger: FastifyBaseLogger
): Promise<CaseDTO> => {
  const forceIds = formatForceNumbers(user.visible_forces)

  if (forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  // TODO: Lock case if user can edit exceptions and audit log
  // TODO: Lock case if user can edit triggers and audit log
  const dbCase = await db.fetchFullCase(caseId, forceIds)

  return convertCaseDBToCaseDTO(dbCase, user, logger)
}

export default fetchFullCaseDTO
