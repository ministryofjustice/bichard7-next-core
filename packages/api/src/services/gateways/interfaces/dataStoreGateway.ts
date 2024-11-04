import type { User } from "@moj-bichard7/common/types/User"

interface DataStoreGateway {
  fetchUserByUsername: (username: string) => Promise<User>
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
}

export default DataStoreGateway
