import type { User } from "@moj-bichard7/common/types/User"

import type { CaseDataForDto } from "../../../types/CaseDataForDto"
import type DataStoreGateway from "../interfaces/dataStoreGateway"

import { LockReason } from "../../../types/LockReason"
import postgresFactory from "../../db/postgresFactory"
import caseCanBeResubmitted from "./postgres/cases/canCaseBeResubmitted"
import fetchCase from "./postgres/cases/fetchCase"
import lockException from "./postgres/cases/lockException"
import fetchUserByUsername from "./postgres/users/fetchUserByUsername"

class Postgres implements DataStoreGateway {
  protected readonly db = postgresFactory()

  async canCaseBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }

  async fetchCase(caseId: number, forceIds: number[]): Promise<CaseDataForDto> {
    return await fetchCase(this.db, caseId, forceIds)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async lockCase(lockReason: LockReason, caseId: number, username: string, forceIds: number[]): Promise<void> {
    if (lockReason === LockReason.Exception) {
      return await lockException(this.db, caseId, username, forceIds)
    }
  }
}

export default Postgres
