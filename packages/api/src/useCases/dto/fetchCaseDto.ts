import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { FullUserRow } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../../services/formatForceNumbers"
import { convertCaseRowToCaseDto } from "./convertCaseRowToDto"

const fetchCaseDTO = async (
  user: FullUserRow,
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
  const dbCase = await db.fetchCase(caseId, forceIds)

  return convertCaseRowToCaseDto(dbCase, user, logger)
}

export default fetchCaseDTO
