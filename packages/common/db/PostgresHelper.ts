import type { IDatabase } from "pg-promise"
import type { IClient, IConnectionParameters } from "pg-promise/typescript/pg-subset"

import pgpLib from "pg-promise"

import { baseConfig } from "./baseConfig"
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

  closeConnection() {
    pgp.end()
  }

  query<T>(sql: string): Promise<T[]> {
    return this.db.any<T>(sql)
  }
}

export default PostgresHelper
