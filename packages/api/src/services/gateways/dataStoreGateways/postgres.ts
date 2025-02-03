import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { CaseDataForDto, CaseMessageId } from "../../../types/Case"
import type DataStoreGateway from "../interfaces/dataStoreGateway"

import { LockReason } from "../../../types/LockReason"
import postgresFactory from "../../db/postgresFactory"
import caseCanBeResubmitted from "./postgres/cases/canCaseBeResubmitted"
import fetchCase from "./postgres/cases/fetchCase"
import lockException from "./postgres/cases/lockException"
import selectMessageId from "./postgres/cases/selectMessageId"
import { transaction } from "./postgres/transaction"
import fetchUserByUsername from "./postgres/users/fetchUserByUsername"

class Postgres implements DataStoreGateway {
  forceIds: number[] = []
  protected readonly postgres = postgresFactory()

  async canCaseBeResubmitted(username: string, caseId: number): Promise<boolean> {
    return await caseCanBeResubmitted(this.postgres, username, caseId, this.forceIds)
  }

  async fetchCase(caseId: number): Promise<CaseDataForDto> {
    return await fetchCase(this.postgres, caseId, this.forceIds)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.postgres, username)
  }

  async lockCase(sql: postgres.Sql, lockReason: LockReason, caseId: number, username: string): Promise<boolean> {
    if (lockReason === LockReason.Exception) {
      return await lockException(sql, caseId, username, this.forceIds)
    }

    return false
  }

  async selectCaseMessageId(caseId: number): Promise<CaseMessageId> {
    return await selectMessageId(this.postgres, caseId, this.forceIds)
  }

  async transaction(callback: (sql: postgres.Sql) => unknown): Promise<unknown> {
    return await transaction(this.postgres, callback)
  }
}

export default Postgres
