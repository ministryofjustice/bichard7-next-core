import type { User } from "@moj-bichard7/common/types/User"
import postgresFactory from "../db/postgresFactory"
import type Gateway from "./interfaces/gateway"
import caseCanBeResubmitted from "./postgres/canCaseBeResubmitted"
import fetchUserByUsername from "./postgres/fetchUserByUsername"

class PostgresGateway implements Gateway {
  protected readonly db = postgresFactory()

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async canCaseBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }
}

export default PostgresGateway
