import type { DataSource, EntityManager } from "typeorm"
import { Brackets } from "typeorm"
import type PromiseResult from "../types/PromiseResult"
import User from "./entities/User"

const getSupervisedUsers = async (dataSource: DataSource | EntityManager, currentUser: User): PromiseResult<User[]> => {
  const queryBuilder = dataSource.getRepository(User).createQueryBuilder("user")

  const userForceQuery = queryBuilder.where('"user"."deleted_at" IS NULL').andWhere(
    new Brackets((qb) => {
      currentUser.visibleForces.forEach((force, index) => {
        qb.orWhere(`"user"."visible_forces" ~ :force${index}`, { [`force${index}`]: String.raw`\y${force}\y` })
      })
    })
  )

  return userForceQuery.getMany()
}

export default getSupervisedUsers
