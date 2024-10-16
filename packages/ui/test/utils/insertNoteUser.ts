import type Note from "services/entities/Note"
import type User from "services/entities/User"
import users from "../../cypress/fixtures/users"
import { getDummyUser, insertUsers } from "./manageUsers"
import { formatForenames, formatSurname } from "./userName"

export const insertNoteUser = async (lockedCase: Note): Promise<null> => {
  let user: Partial<User>

  const username = lockedCase.userId

  if (users[username]) {
    user = users[username]
  } else {
    const [forenames, surname] = username.split(".")
    user = await getDummyUser({
      username,
      forenames: formatForenames(forenames),
      surname: formatSurname(surname),
      email: `${username}@example.com`
    })
  }

  return insertUsers(user as User)
}
