import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import Postgres from "../../services/gateways/dataStoreGateways/postgres"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import clearAllTables from "./e2ePostgres/clearAllTables"
import insertCase from "./e2ePostgres/insertCase"
import insertUser from "./e2ePostgres/insertUser"
import insertUserIntoGroup from "./e2ePostgres/insertUserIntoGroup"

class End2EndPostgres extends Postgres implements DataStoreGateway {
  constructor() {
    super()
  }

  async close() {
    await this.db.end()
  }

  async createTestUser(user: Partial<User>): Promise<User> {
    if (!user.groups || user.groups.length === 0) {
      throw new Error("User has no Groups")
    }

    const dbUser = await insertUser(this.db, user)
    await insertUserIntoGroup(this.db, dbUser, user.groups)

    dbUser.groups = user.groups

    return dbUser
  }

  async createTestCase(partialCase: Partial<Case>): Promise<Case> {
    return await insertCase(this.db, partialCase)
  }

  async clearDb(): Promise<boolean> {
    return await clearAllTables(this.db)
  }
}

export default End2EndPostgres
