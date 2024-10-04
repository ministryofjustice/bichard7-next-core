import type { IDatabase } from "pg-promise"
import pgpLib from "pg-promise"
import type { IClient, IConnectionParameters } from "pg-promise/typescript/pg-subset"

const pgp = pgpLib()

pgp.pg.types.setTypeParser(1082, (stringValue) => stringValue)

let postgresConnection: IDatabase<unknown>

const options: IConnectionParameters<IClient> = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || "5432"),
  database: "bichard",
  user: process.env.DB_USER || "bichard",
  password: process.env.DB_PASSWORD || "password",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
}

class PostgresHelper {
  public db: IDatabase<unknown>

  constructor() {
    if (!postgresConnection) {
      postgresConnection = pgp(options)
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
