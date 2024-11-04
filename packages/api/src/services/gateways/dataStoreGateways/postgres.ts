import type { User } from "@moj-bichard7/common/types/User"
import postgresFactory from "../../db/postgresFactory"
import type DataStoreGateway from "../interfaces/dataStoreGateway"
import caseCanBeResubmitted from "./postgres/canCaseBeResubmitted"
import fetchUserByUsername from "./postgres/fetchUserByUsername"

// TODO: Check what permission the user has (triggers or exceptions) and add lock
// TODO: Add AuditLogEvent
class Postgres implements DataStoreGateway {
  protected readonly db = postgresFactory()

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async canCaseBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }
}

export default Postgres
