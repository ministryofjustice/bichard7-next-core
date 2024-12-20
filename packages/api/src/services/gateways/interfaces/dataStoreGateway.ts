import type { CaseDB } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
  fetchFullCase: (caseId: number, forceIds: number[]) => Promise<CaseDB>
  fetchUserByUsername: (username: string) => Promise<User>
}

export default DataStoreGateway
