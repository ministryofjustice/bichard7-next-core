import type postgres from "postgres"

import type DatabaseGateway from "../../../types/DatabaseGateway"
import type {
  DatabaseConnection,
  TransactionDatabaseConnection,
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

class PostgresTransactionConnection implements WritableDatabaseConnection {
  readonly connection: postgres.TransactionSql<{}>
  readonly isWritable = true

  constructor(trxSql: postgres.TransactionSql<{}>) {
    this.connection = trxSql
  }
}

class PostgresWritableConnection implements TransactionDatabaseConnection {
  readonly connection: postgres.Sql<{}>
  readonly isWritable = true

  constructor(sql?: postgres.Sql<{}>) {
    this.connection = sql ?? postgresFactory()
  }

  transaction<T>(callback: (connection: WritableDatabaseConnection) => Promise<T>) {
    return this.connection.begin("read write", (transactionSql): Promise<T> => {
      return callback(new PostgresTransactionConnection(transactionSql))
    }) as Promise<T>
  }
}

export default Postgres
