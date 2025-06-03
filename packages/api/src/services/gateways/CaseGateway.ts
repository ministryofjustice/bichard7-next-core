import type { CaseAges, CaseDto } from "@moj-bichard7/common/types/Case"
import type { Note } from "@moj-bichard7/common/types/Note"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import type { Filters, Pagination, SortOrder } from "../../types/CaseIndexQuerystring"
import type DatabaseGateway from "../../types/DatabaseGateway"
import type { LockReason } from "../../types/LockReason"
import type { FetchCasesResult } from "../db/cases/fetchCases"

import canCaseBeResubmitted from "../db/cases/canCaseBeResubmitted"
import fetchCase from "../db/cases/fetchCase"
import { fetchCaseAges } from "../db/cases/fetchCaseAges"
import fetchCases from "../db/cases/fetchCases"
import fetchNotes from "../db/cases/fetchNotes"
import fetchTriggers from "../db/cases/fetchTriggers"
import selectMessageId from "../db/cases/selectMessageId"

export default class CaseGateway {
  constructor(
    private database: DatabaseGateway,
    private logger: FastifyBaseLogger,
    private user: User
  ) {}

  canCaseBeResubmitted(caseId: number): PromiseResult<boolean> {
    return canCaseBeResubmitted(this.database.readonly, this.user, caseId)
  }

  fetchCase(caseId: number): PromiseResult<CaseDto> {
    return fetchCase(this.database.readonly, this.user, caseId, this.logger)
  }

  fetchCaseAges(): PromiseResult<CaseAges> {
    return fetchCaseAges(this.database.readonly, this.user)
  }

  fetchCases(
    user: User,
    pagination: Pagination,
    sortOrder: SortOrder,
    filters: Filters
  ): PromiseResult<FetchCasesResult> {
    return fetchCases(this.database.readonly, user, pagination, sortOrder, filters)
  }

  fetchNotes(caseIds: number[]): PromiseResult<Note[]> {
    return fetchNotes(this.database.readonly, caseIds)
  }

  fetchTriggers(caseIds: number[], user: User, filters: Filters): PromiseResult<Trigger[]> {
    return fetchTriggers(this.database.readonly, user, caseIds, filters)
  }

  async lockCase(_lockReason: LockReason, _caseId: number, _username: string): PromiseResult<boolean> {
    // if (lockReason === LockReason.Exception) {
    //   return await lockException(this.database., caseId, username)
    // } else if (lockReason === LockReason.Trigger) {
    //   return await lockTrigger(callbackSql, caseId, username)
    // }
    return false
  }

  async selectCaseMessageId(caseId: number): PromiseResult<string> {
    return selectMessageId(this.database.readonly, this.user, caseId)
  }
}
