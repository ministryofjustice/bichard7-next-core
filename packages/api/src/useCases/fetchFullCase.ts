import type { CaseDTO } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../services/formatForceNumbers"

// TODO: Rename this UseCase
const fetchFullCase = async (user: User, db: DataStoreGateway, caseId: number): Promise<CaseDTO> => {
  const forceIds = formatForceNumbers(user.visible_forces)

  if (forceIds.length === 0) {
    throw new Error("No force associated to User")
  }

  const dbCase = await db.fetchFullCase(caseId, forceIds)

  // TODO: Create a UseCase to covert the CaseDB type CaseFullDTO type
  return {
    aho: dbCase.annotated_msg,
    asn: dbCase.asn,
    updatedHearingOutcome: dbCase.updated_msg
  } satisfies CaseDTO
}

export default fetchFullCase
