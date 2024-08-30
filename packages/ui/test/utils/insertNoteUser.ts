import Note from "services/entities/Note"
import { getDummyUser, insertUsers } from "./manageUsers"
import { formatForenames, formatSurname } from "./userName"

export const insertNoteUser = async (lockedCase: Note): Promise<null> => {
  const username = lockedCase.userId
  const [forenames, surname] = username.split(".")
  const user = await getDummyUser({
    username,
    forenames: formatForenames(forenames),
    surname: formatSurname(surname),
    email: `${username}@example.com`
  })

  return insertUsers(user)
}
