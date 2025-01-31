import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import Postgres from "../../services/gateways/dataStoreGateways/postgres"
import clearAllTables from "./e2ePostgres/clearAllTables"
import insertCase from "./e2ePostgres/insertCase"
import insertUser from "./e2ePostgres/insertUser"
import insertUserIntoGroup from "./e2ePostgres/insertUserIntoGroup"

class End2EndPostgres extends Postgres implements DataStoreGateway {
  async clearDb(): Promise<boolean> {
    return await clearAllTables(this.postgres)
  }

  async close() {
    await this.postgres.end()
  }

  async createTestCase(partialCase: Partial<Case>): Promise<Case> {
    return await insertCase(this.postgres, partialCase)
  }

  async createTestUser(user: Partial<User>): Promise<User> {
    if (!user.groups || user.groups.length === 0) {
      throw new Error("User has no Groups")
    }

    const dbUser = await insertUser(this.postgres, user)
    await insertUserIntoGroup(this.postgres, dbUser, user.groups)

    dbUser.groups = user.groups

    return dbUser
  }
}

export default End2EndPostgres
