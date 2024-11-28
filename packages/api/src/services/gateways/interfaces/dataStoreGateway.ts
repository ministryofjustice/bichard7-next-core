import type { User } from "@moj-bichard7/common/types/User"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number, forceIds: number[]) => Promise<boolean>
  fetchUserByUsername: (username: string) => Promise<User>
}

export default DataStoreGateway
