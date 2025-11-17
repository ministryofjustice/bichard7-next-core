import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"

export default async (connection: Database, visibleForces: string | undefined): PromiseResult<Partial<User>[]> => {
  let users = []
  if (visibleForces != undefined && visibleForces !== "") {
    const forces = visibleForces.split(",")

    const forceWhere = forces.map((code) => `visible_forces ~ '\\y${code}\\y'`).join(" OR ")
    const getFilteredUsersQuery = `
      SELECT
        u.id,
        username,
        forenames,
        surname,
        email
      FROM br7own.users as u
      INNER JOIN br7own.users_groups as ug ON u.id = ug.user_id
      INNER JOIN br7own.groups as g ON g.id = ug.group_id
      WHERE deleted_at IS NULL
        AND ( ${forceWhere} )
        AND g.name = 'B7UserManager_grp'
      ORDER BY username
    `
    try {
      users = await connection.any(getFilteredUsersQuery)
    } catch (error) {
      return error as Error
    }
  }

  return users.map((r) => ({
    id: r.id,
    username: r.username,
    forenames: r.forenames,
    surname: r.surname,
    emailAddress: r.email
  }))
}
