import type { User } from "@moj-bichard7/common/types/User"

import type { CaseDataForDto } from "../../../types/CaseDataForDto"
import type { LockReason } from "../../../types/LockReason"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
  fetchCase: (caseId: number, forceIds: number[]) => Promise<CaseDataForDto>
  fetchUserByUsername: (username: string) => Promise<User>
  lockCase: (lockReason: LockReason, caseId: number, username: string, forceIds: number[]) => Promise<boolean>
}

export default DataStoreGateway
