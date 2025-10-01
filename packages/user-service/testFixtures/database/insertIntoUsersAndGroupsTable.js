import getTestConnection from "../getTestConnection"
import insertIntoGroupsTable from "./insertIntoGroupsTable"
import insertIntoUsersTable from "./insertIntoUsersTable"

const randomlySelectGroupId = (groups) => {
  const max = groups.length - 1
  return groups[Math.round(Math.random() * max)].id
}

const insertIntoUsersAndGroupsTable = async (users, groups) => {
  const connection = getTestConnection()

  await insertIntoUsersTable(users)
  await insertIntoGroupsTable(groups)

  const selectFromGroupsQuery = "SELECT id FROM br7own.groups"
  const selectFromUsersQuery = "SELECT id FROM br7own.users"

  const selectedGroups = await connection.any(selectFromGroupsQuery)
  const selectedUsers = await connection.any(selectFromUsersQuery)

  const insertQuery = `
    INSERT INTO
      br7own.users_groups(
        group_id,
        user_id
      ) VALUES (
        $\{group_id\},
        $\{user_id\}
      )
  `

  const queries = selectedUsers.map((user) =>
    connection.none(insertQuery, { group_id: randomlySelectGroupId(selectedGroups), user_id: user.id })
  )

  return Promise.all(queries)
}

export default insertIntoUsersAndGroupsTable
