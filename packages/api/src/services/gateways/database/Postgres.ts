import type postgres from "postgres"

import type DatabaseGateway from "../../../types/DatabaseGateway"
import type {
  DatabaseConnection,
  TransactionConnection,
  WritableDatabaseConnection
} from "../../../types/DatabaseGateway"

import postgresFactory from "./postgresFactory"

class Postgres implements DatabaseGateway {
  readonly readonly: PostgresReadableConnection
  readonly writable: PostgresWritableConnection

  constructor() {
    this.readonly = new PostgresReadableConnection()
    this.writable = new PostgresWritableConnection()
  }
}

class PostgresReadableConnection implements DatabaseConnection {
  readonly connection: postgres.Sql<{}>

  constructor() {
    this.connection = postgresFactory({ readOnly: true })
  }
}

class PostgresTransactionConnection implements TransactionConnection {
  readonly connection: postgres.TransactionSql<{}>
  readonly isWritable = true as const

  constructor(trxSql: postgres.TransactionSql<{}>) {
    this.connection = trxSql
  }
}

class PostgresWritableConnection implements WritableDatabaseConnection {
  readonly connection: postgres.Sql<{}>
  readonly isWritable = true as const

  constructor() {
    this.connection = postgresFactory()
  }

  transaction<T>(callback: (connection: TransactionConnection) => Promise<T>): Promise<T> {
    return this.connection.begin((trxSql) => callback(new PostgresTransactionConnection(trxSql))) as Promise<T>
  }
}

export default Postgres
