import type postgres from "postgres"

export interface DatabaseConnection {
  connection: postgres.Sql<{}>
}

export interface WritableDatabaseConnection extends DatabaseConnection {
  readonly transaction: <T>(callback: (connection: WritableDatabaseConnection) => Promise<T>) => Promise<T>
}
interface DatabaseGateway {
  readonly readonly: DatabaseConnection
  readonly writable: WritableDatabaseConnection
}

export default DatabaseGateway
