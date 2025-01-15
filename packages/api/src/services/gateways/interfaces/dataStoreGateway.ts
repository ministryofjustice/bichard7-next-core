import type { PartialCaseRow } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
  fetchCase: (caseId: number, forceIds: number[]) => Promise<PartialCaseRow>
  fetchUserByUsername: (username: string) => Promise<User>
}

export default DataStoreGateway
