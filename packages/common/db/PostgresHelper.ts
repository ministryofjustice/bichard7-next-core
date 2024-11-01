import type { IDatabase } from "pg-promise"
import pgpLib from "pg-promise"
import { baseConfig } from "./baseConfig"
import type { IClient, IConnectionParameters } from "pg-promise/typescript/pg-subset"
const pgp = pgpLib()

pgp.pg.types.setTypeParser(1082, (stringValue) => stringValue)

let postgresConnection: IDatabase<unknown>

class PostgresHelper {
  public db: IDatabase<unknown>

  constructor() {
    if (!postgresConnection) {
      postgresConnection = pgp(baseConfig as IConnectionParameters<IClient>)
    }

    this.db = postgresConnection
  }

  // eslint-disable-next-line class-methods-use-this
  closeConnection() {
    pgp.end()
  }

  query<T>(sql: string): Promise<T[]> {
    return this.db.any<T>(sql)
  }
}

export default PostgresHelper
