import getTestConnection from "../getTestConnection"

const insertIntoUsersTable = async (data) => {
  const connection = getTestConnection()

  const insertQuery = `
    INSERT INTO
      br7own.users(
        username,
        created_at,
        endorsed_by,
        last_logged_in,
        org_serves,
        forenames,
        surname,
        email,
        password,
        last_login_attempt,
        deleted_at,
        password_reset_code,
        migrated_password,
        visible_forces,
        visible_courts,
        excluded_triggers,
        feature_flags
      ) VALUES (
        $\{username\},
        $\{created_at\},
        $\{endorsed_by\},
        $\{last_logged_in\},
        $\{org_serves\},
        $\{forenames\},
        $\{surname\},
        $\{email\},
        $\{password\},
        $\{last_login_attempt\},
        $\{deleted_at\},
        $\{password_reset_code\},
        $\{migrated_password\},
        $\{visible_forces\},
        $\{visible_courts\},
        $\{excluded_triggers\},
        $\{feature_flags\}
  )
  `

  const queries = data.map((datum) => connection.none(insertQuery, { ...datum }))

  return Promise.all(queries)
}

export default insertIntoUsersTable
