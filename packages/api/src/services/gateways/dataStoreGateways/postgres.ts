import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../interfaces/dataStoreGateway"

import postgresFactory from "../../db/postgresFactory"
import caseCanBeResubmitted from "./postgres/canCaseBeResubmitted"
import fetchFullCase from "./postgres/fetchFullCase"
import fetchUserByUsername from "./postgres/fetchUserByUsername"

class Postgres implements DataStoreGateway {
  protected readonly db = postgresFactory()

  async canCaseBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }

  async fetchFullCase(caseId: number, forceIds: number[]): Promise<Case> {
    return await fetchFullCase(this.db, caseId, forceIds)
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }
}

export default Postgres
