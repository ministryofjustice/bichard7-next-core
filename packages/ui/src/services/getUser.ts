import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { DataSource, EntityManager } from "typeorm"

import type PromiseResult from "../types/PromiseResult"

import { isError } from "../types/Result"
import User from "./entities/User"

export default async (
  dataSource: DataSource | EntityManager,
  username: string,
  groups?: string[]
): PromiseResult<null | User> => {
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ username: username })
    .catch((error: Error) => error)

  if (isError(user)) {
    return user
  }

  if (user && groups && groups.length > 0) {
    user.groups = groups
      .map((group) =>
        group
          .replace("B7", "")
          .replace("_grp", "")
          .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
      )
      .map((group) => group as UserGroup)
  }

  return user
}
