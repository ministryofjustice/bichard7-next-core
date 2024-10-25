import type { Case } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type Gateway from "../../services/gateways/interfaces/gateway"
import PostgresGateway from "../../services/gateways/postgresGateway"
import clearAllTables from "./e2ePostgresGateway/clearAllTables"
import insertCase from "./e2ePostgresGateway/insertCase"
import insertUser from "./e2ePostgresGateway/insertUser"
import insertUserIntoGroup from "./e2ePostgresGateway/insertUserIntoGroup"

class End2EndPostgresGateway extends PostgresGateway implements Gateway {
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

export default End2EndPostgresGateway
