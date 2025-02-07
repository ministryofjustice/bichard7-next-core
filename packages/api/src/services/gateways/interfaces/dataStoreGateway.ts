import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { CaseDataForDto, CaseMessageId } from "../../../types/Case"
import type { LockReason } from "../../../types/LockReason"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number) => Promise<boolean>
  fetchCase: (caseId: number) => Promise<CaseDataForDto>
  fetchUserByUsername: (username: string) => Promise<User>
  forceIds: number[]
  lockCase: (callbackSql: postgres.Sql, lockReason: LockReason, caseId: number, username: string) => Promise<boolean>
  selectCaseMessageId: (caseId: number) => Promise<CaseMessageId>
  transaction: (callback: (callbackSql: postgres.Sql) => unknown) => Promise<unknown>
}

export default DataStoreGateway
