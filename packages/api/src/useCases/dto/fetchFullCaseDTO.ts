import type { CaseDTO } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../../services/formatForceNumbers"
import { convertCaseDBToCaseDTO } from "./convertCaseDBToDTO"

const fetchFullCaseDTO = async (user: User, db: DataStoreGateway, caseId: number): Promise<CaseDTO> => {
  const forceIds = formatForceNumbers(user.visible_forces)

  if (forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  const dbCase = await db.fetchFullCase(caseId, forceIds)

  return convertCaseDBToCaseDTO(dbCase)
}

export default fetchFullCaseDTO
