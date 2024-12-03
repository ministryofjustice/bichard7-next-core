import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type Note from "services/entities/Note"
import type User from "services/entities/User"
import users from "../../cypress/fixtures/users"
import { getDummyUser, insertUsersWithOverrides } from "./manageUsers"
import { formatForenames, formatSurname } from "./userName"

export const insertNoteUser = async (lockedCase: Note): Promise<null> => {
  let user: Partial<User>
  let groups: UserGroup[]

  const username = lockedCase.userId

  if (users[username]) {
    user = users[username]
    groups = users[username].groups
  } else {
    const [forenames, surname] = username.split(".")
    user = await getDummyUser({
      username,
      forenames: formatForenames(forenames),
      surname: formatSurname(surname),
      email: `${username}@example.com`
    })
    groups = [UserGroup.NewUI, UserGroup.GeneralHandler]
  }

  return insertUsersWithOverrides([user], groups)
}
