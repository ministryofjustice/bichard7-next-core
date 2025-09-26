import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import type Task from "types/Task"

export default (connection: Database | Task, userId: number, oldPassword: string): PromiseResult<void> => {
  const addPasswordQuery = `
      INSERT INTO br7own.password_history(
        user_id,
        password_hash,
        last_used
      )
      VALUES (
        \${userId},
        \${passwordHash},
        NOW()
      )
    `
  return connection.result(addPasswordQuery, { userId, passwordHash: oldPassword }).catch((error) => error)
}
