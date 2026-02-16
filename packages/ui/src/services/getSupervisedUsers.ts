import type { DataSource, EntityManager } from "typeorm"
import { Raw, Brackets } from "typeorm"
import type PromiseResult from "../types/PromiseResult"
import User from "./entities/User"

function getVisibleForce(index: number, force: string) {
  return Raw((alias) => `${alias} ~ :force${index}`, { [`force${index}`]: String.raw`'\y${force}\y'` })
}

const getSupervisedUsers = async (dataSource: DataSource | EntityManager, currentUser: User): PromiseResult<User[]> => {
  const queryBuilder = dataSource.getRepository(User).createQueryBuilder("user")

  const userForceQuery = queryBuilder.where("user.deleted_at IS NULL").andWhere(
    new Brackets((qb) => {
      currentUser.visibleForces.forEach((force, index) => {
        qb.orWhere({ visibleForces: getVisibleForce(index, force) })
      })
    })
  )

  return userForceQuery.getMany()
}

export default getSupervisedUsers
