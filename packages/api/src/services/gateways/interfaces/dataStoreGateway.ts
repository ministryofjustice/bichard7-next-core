import type { User } from "@moj-bichard7/common/types/User"

import type { CaseDataForDto } from "../../../types/CaseDataForDto"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
  fetchCase: (caseId: number, forceIds: number[]) => Promise<CaseDataForDto>
  fetchUserByUsername: (username: string) => Promise<User>
}

export default DataStoreGateway
