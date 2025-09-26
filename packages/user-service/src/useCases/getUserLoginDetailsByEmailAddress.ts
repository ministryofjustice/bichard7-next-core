import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

interface LoginDetails {
  id: number
  password: string
}

export default (db: Database, emailAddress: string): PromiseResult<LoginDetails> => {
  const query = `
      SELECT
        id,
        password
      FROM br7own.users
      WHERE LOWER(email) = LOWER(\${emailAddress})
        AND deleted_at IS NULL
    `
  return db.one<LoginDetails>(query, { emailAddress }).catch((error) => error)
}
