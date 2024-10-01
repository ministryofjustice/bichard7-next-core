import type { User } from "@moj-bichard7/common/types/User"

interface Gateway {
  fetchUserByUsername: (username: string) => Promise<User>
  filterUserHasSameForceAsCaseAndLockedByUser: (username: string, caseId: number, forceIds: number[]) => Promise<number>
}

export default Gateway
