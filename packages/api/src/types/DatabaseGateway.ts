import type postgres from "postgres"

export interface DatabaseConnection {
  connection: postgres.Sql<{}> | postgres.TransactionSql<{}>
}

export default interface DatabaseGateway {
  readonly readonly: ReadableDatabaseConnection
  readonly writable: TransactionDatabaseConnection
}

export interface ReadableDatabaseConnection extends DatabaseConnection {
  connection: postgres.Sql<{}>
}

export interface TransactionDatabaseConnection extends WritableDatabaseConnection {
  connection: postgres.Sql<{}>

  readonly transaction: <T>(callback: (connection: WritableDatabaseConnection) => Promise<T>) => Promise<T>
}

export interface WritableDatabaseConnection extends DatabaseConnection {
  readonly isWritable: true
}
