import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../services/formatForceNumbers"

const fetchFullCase = async (user: User, db: DataStoreGateway, caseId: number) => {
  const forceIds = formatForceNumbers(user.visible_forces)

  if (forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  return await db.fetchFullCase(caseId, forceIds)
}

export default fetchFullCase
