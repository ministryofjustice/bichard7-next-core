import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import User from "types/User"

const getUser = async (connection: Database, username: string): PromiseResult<Partial<User>> => {
  let user

  const getUserQuery = `
      SELECT
        id,
        username,
        forenames,
        surname,
        endorsed_by,
        org_serves,
        email
      FROM br7own.users
      WHERE username = $1 AND deleted_at IS NULL
    `
  try {
    user = await connection.one(getUserQuery, [username])
  } catch (error) {
    return isError(error) ? error : Error("Error getting user")
  }

  return {
    id: user.id,
    username: user.username,
    forenames: user.forenames,
    surname: user.surname,
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    emailAddress: user.email
  }
}

export default getUser
