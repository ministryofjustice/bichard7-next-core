import type { User } from "@moj-bichard7/common/types/User"
import postgresFactory from "../db/postgresFactory"
import type Gateway from "./interfaces/gateway"
import fetchUserByUsername from "./postgres/fetchUserByUsername"
import filterUserHasSameForceAsCaseAndLockedByUser from "./postgres/filterUserHasSameForceAsCaseAndLockedByUser"

class PostgresGateway implements Gateway {
  private db = postgresFactory()

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async filterUserHasSameForceAsCaseAndLockedByUser(
    username: string,
    caseId: number,
    forceIds: number[]
  ): Promise<number> {
    return await filterUserHasSameForceAsCaseAndLockedByUser(this.db, username, caseId, forceIds)
  }
}

export default PostgresGateway
