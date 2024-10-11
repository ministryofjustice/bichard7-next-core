import type { User } from "@moj-bichard7/common/types/User"
import postgresFactory from "../db/postgresFactory"
import type Gateway from "./interfaces/gateway"
import caseCanBeResubmitted from "./postgres/caseCanBeResubmitted"
import fetchUserByUsername from "./postgres/fetchUserByUsername"

class PostgresGateway implements Gateway {
  private readonly db = postgresFactory()

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async caseCanBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }
}

export default PostgresGateway
