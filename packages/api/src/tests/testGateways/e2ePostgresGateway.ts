import type { User } from "@moj-bichard7/common/types/User"
import type Gateway from "../../services/gateways/interfaces/gateway"
import PostgresGateway from "../../services/gateways/postgresGateway"
import clearAllTables from "./e2ePostgresGateway/clearAllTables"
import insertUser from "./e2ePostgresGateway/insertUser"

class End2EndPostgresGateway extends PostgresGateway implements Gateway {
  constructor() {
    super()
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await insertUser(this.db, user)
  }

  async clearDb(): Promise<boolean> {
    return await clearAllTables(this.db)
  }
}

export default End2EndPostgresGateway
