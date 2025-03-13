import type { Note } from "@moj-bichard7/common/types/Note"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { CaseDataForDto, CaseDataForIndexDto, CaseMessageId } from "../../../types/Case"
import type { Filters, Pagination, SortOrder } from "../../../types/CaseIndexQuerystring"
import type DataStoreGateway from "../interfaces/dataStoreGateway"

import { LockReason } from "../../../types/LockReason"
import postgresFactory from "../../db/postgresFactory"
import caseCanBeResubmitted from "./postgres/cases/canCaseBeResubmitted"
import fetchCase from "./postgres/cases/fetchCase"
import fetchCases from "./postgres/cases/fetchCases"
import fetchNotes from "./postgres/cases/fetchNotes"
import fetchTriggers from "./postgres/cases/fetchTriggers"
import lockException from "./postgres/cases/lockException"
import lockTrigger from "./postgres/cases/lockTrigger"
import selectMessageId from "./postgres/cases/selectMessageId"
import { organisationUnitSql } from "./postgres/organisationUnitSql"
import { transaction } from "./postgres/transaction"
import fetchUserByUsername from "./postgres/users/fetchUserByUsername"

class Postgres implements DataStoreGateway {
  forceIds: number[] = []
  visibleCourts: string[] = []
  protected readonly postgres = postgresFactory()

  async canCaseBeResubmitted(username: string, caseId: number): Promise<boolean> {
    return await caseCanBeResubmitted(this.postgres, username, caseId, this.forceIds)
  }

  async fetchCase(caseId: number): Promise<CaseDataForDto> {
    return await fetchCase(this.postgres, caseId, this.generatedOrganisationUnitSql())
  }

  async fetchCases(
    user: User,
    pagination: Pagination,
    sortOrder: SortOrder,
    filters: Filters
  ): Promise<CaseDataForIndexDto[]> {
    return await fetchCases(this.postgres, this.generatedOrganisationUnitSql(), user, pagination, sortOrder, filters)
  }

  async fetchNotes(errorIds: number[]): Promise<Note[]> {
    return await fetchNotes(this.postgres, errorIds)
  }

  async fetchTriggers(errorIds: number[], filters: Filters, user: User): Promise<Trigger[]> {
    return await fetchTriggers(this.postgres, errorIds, filters, user)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.postgres, username)
  }

  generatedOrganisationUnitSql(): postgres.PendingQuery<postgres.Row[]> {
    return organisationUnitSql(this.postgres, this.visibleCourts, this.forceIds)
  }

  async lockCase(
    callbackSql: postgres.Sql,
    lockReason: LockReason,
    caseId: number,
    username: string
  ): Promise<boolean> {
    if (lockReason === LockReason.Exception) {
      return await lockException(callbackSql, caseId, username, this.generatedOrganisationUnitSql())
    } else if (lockReason === LockReason.Trigger) {
      return await lockTrigger(callbackSql, caseId, username, this.generatedOrganisationUnitSql())
    }

    return false
  }

  async selectCaseMessageId(caseId: number): Promise<CaseMessageId> {
    return await selectMessageId(this.postgres, caseId, this.generatedOrganisationUnitSql())
  }

  async transaction(callback: (callbackSql: postgres.Sql) => unknown): Promise<unknown> {
    return await transaction(this.postgres, callback)
  }
}

export default Postgres
