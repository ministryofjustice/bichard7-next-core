import type { DataSource, EntityManager } from "typeorm"
import type User from "./entities/User"
import type PromiseResult from "../types/PromiseResult"

export default (_dataSource: DataSource | EntityManager, _username: string): PromiseResult<User[]> => {
  return Promise.resolve([])
}
