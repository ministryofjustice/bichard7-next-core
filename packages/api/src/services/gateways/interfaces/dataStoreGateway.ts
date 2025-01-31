import type { User } from "@moj-bichard7/common/types/User"

import type { CaseDataForDto } from "../../../types/CaseDataForDto"
import type { LockReason } from "../../../types/LockReason"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number) => Promise<boolean>
  fetchCase: (caseId: number) => Promise<CaseDataForDto>
  fetchUserByUsername: (username: string) => Promise<User>
  forceIds: number[]
  lockCase: (lockReason: LockReason, caseId: number, username: string) => Promise<boolean>
}

export default DataStoreGateway
