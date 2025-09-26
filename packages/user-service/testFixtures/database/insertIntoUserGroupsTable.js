import getTestConnection from "../getTestConnection"

const insertIntoUserGroupsTable = (userEmailAddress, groups) => {
  const connection = getTestConnection()

  /* eslint-disable no-useless-escape */
  const insertQuery = `
    INSERT INTO 
      br7own.users_groups(
        group_id, 
        user_id
      ) VALUES (
        (SELECT id FROM br7own.groups WHERE name=$\{groupName\} LIMIT 1),
        (SELECT id FROM br7own.users WHERE email=$\{userEmailAddress\} LIMIT 1)
      )
  `

  return Promise.allSettled(groups.map((groupName) => connection.none(insertQuery, { groupName, userEmailAddress })))
}

export default insertIntoUserGroupsTable
