import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"

export default (db: Database, emailAddress: string, currentUserId: number): PromiseResult<void> => {
  const query = `
      UPDATE br7own.users
      SET deleted_at = NOW()
      WHERE LOWER(email) = LOWER($1) AND id != $2 AND deleted_at IS NULL
    `

  return db.none(query, [emailAddress, currentUserId]).catch((error) => error)
}
