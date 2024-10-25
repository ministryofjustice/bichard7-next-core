import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import users from "../../cypress/fixtures/users"
import { getDummyUser, insertUsersWithOverrides } from "./manageUsers"

const insertLockUser = async (name: string, createFakeUser: boolean) => {
  let user: Partial<User>
  let groups: UserGroup[]

  if (users[name]) {
    user = users[name]
    groups = users[name].groups
  } else {
    if (createFakeUser) {
      user = await getDummyUser()
      groups = [UserGroup.NewUI, UserGroup.GeneralHandler]
    } else {
      throw new Error(`Invalid lock username provided: ${name}`)
    }
  }

  await insertUsersWithOverrides([user], groups)
}

export const insertLockUsers = async (lockedCase: CourtCase, createFakeUser = false): Promise<void> => {
  if (lockedCase.errorLockedByUsername) {
    insertLockUser(lockedCase.errorLockedByUsername, createFakeUser)
  }

  if (lockedCase.triggerLockedByUsername) {
    insertLockUser(lockedCase.triggerLockedByUsername, createFakeUser)
  }
}
