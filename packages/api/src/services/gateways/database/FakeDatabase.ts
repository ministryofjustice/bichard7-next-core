import type DatabaseGateway from "../../../types/DatabaseGateway"
import type { DatabaseConnection, WritableDatabaseConnection } from "../../../types/DatabaseGateway"

class FakeDatabase implements DatabaseGateway {
  readonly = jest.fn() as unknown as DatabaseConnection
  writable = jest.fn() as unknown as WritableDatabaseConnection

  async transactional(callback: (writableSql: WritableDatabaseConnection) => unknown): Promise<unknown> {
    return Promise.resolve(callback(this.writable))
  }
}

export default FakeDatabase
