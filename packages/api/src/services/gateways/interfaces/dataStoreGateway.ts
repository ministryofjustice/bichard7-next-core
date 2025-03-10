import type { Note } from "@moj-bichard7/common/types/Note"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { CaseDataForDto, CaseDataForIndexDto, CaseMessageId } from "../../../types/Case"
import type { Filters, Pagination, SortOrder } from "../../../types/CaseIndexQuerystring"
import type { LockReason } from "../../../types/LockReason"

interface DataStoreGateway {
  canCaseBeResubmitted: (username: string, caseId: number) => Promise<boolean>
  fetchCase: (caseId: number) => Promise<CaseDataForDto>
  fetchCases: (
    user: User,
    pagination: Pagination,
    sortOrder: SortOrder,
    filters: Filters
  ) => Promise<CaseDataForIndexDto[]>
  fetchNotes: (errorIds: number[]) => Promise<Note[]>
  fetchTriggers: (errorIds: number[], filters: Filters, user: User) => Promise<Trigger[]>
  fetchUserByUsername: (username: string) => Promise<User>
  forceIds: number[]
  lockCase: (callbackSql: postgres.Sql, lockReason: LockReason, caseId: number, username: string) => Promise<boolean>
  selectCaseMessageId: (caseId: number) => Promise<CaseMessageId>
  transaction: (callback: (callbackSql: postgres.Sql) => unknown) => Promise<unknown>
}

export default DataStoreGateway
