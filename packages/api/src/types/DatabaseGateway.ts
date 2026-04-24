import type postgres from "postgres"

export interface DatabaseConnection {
  connection: postgres.Sql<{}> | postgres.TransactionSql<{}>
}

export default interface DatabaseGateway {
  readonly readonly: ReadableDatabaseConnection
  readonly writable: WritableDatabaseConnection
}

export interface ReadableDatabaseConnection extends DatabaseConnection {
  connection: postgres.Sql<{}>
}

export interface TransactionConnection extends DatabaseConnection {
  connection: postgres.TransactionSql<{}>
  readonly isWritable: true
}

export interface WritableDatabaseConnection extends DatabaseConnection {
  connection: postgres.Sql<{}>
  readonly isWritable: true
  readonly transaction: <T>(callback: (connection: TransactionConnection) => Promise<T>) => Promise<T>
}
