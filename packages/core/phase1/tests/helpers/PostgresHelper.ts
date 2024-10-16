import type { IDatabase } from "pg-promise"
import pgPromise from "pg-promise"
import type pg from "pg-promise/typescript/pg-subset"

const pgp = pgPromise()

export default class PostgresHelper {
  public pg: IDatabase<{}, pg.IClient>

  constructor(options: pg.IConnectionParameters<pg.IClient>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = global as any
    if (!g.postgresConnection) {
      g.postgresConnection = pgp(options)
    }

    this.pg = g.postgresConnection as IDatabase<{}, pg.IClient>
  }

  static closeConnection() {
    pgp?.end()
  }

  query<T>(sql: string): Promise<T[]> {
    return this.pg.any<T>(sql)
  }
}
