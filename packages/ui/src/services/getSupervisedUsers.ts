import type { DataSource, EntityManager } from "typeorm"
import type PromiseResult from "../types/PromiseResult"
import User from "./entities/User"

export default async (dataSource: DataSource | EntityManager, currentUser: User): PromiseResult<User[]> => {
  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.visible_forces = :visibleForces", { visibleForces: currentUser.visibleForces[0] })
    .getMany()

  return user
}
