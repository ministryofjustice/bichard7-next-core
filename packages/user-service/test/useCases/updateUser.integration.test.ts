import { isError } from "types/Result"
import updateUser from "useCases/updateUser"
import createUser from "useCases/createUser"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import fakeAuditLogger from "../fakeAuditLogger"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"

describe("updatePassword", () => {
  let connection: Database

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  beforeAll(() => {
    connection = getTestConnection()
  })

  afterAll(() => {
    connection.$pool.end()
  })

  const insertUserWithGroup = async () => {
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const user = users.filter((u) => u.username === "Bichard02")[0]

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groups: [initialGroup],
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    await createUser(connection, currentUser, createUserDetails)
  }

  it("should update user successfully when called", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    await insertUserWithGroup()
    const emailAddress = "bichard02@example.com"
    const initialUserList = await selectFromTable("users", "email", emailAddress)
    const initialUser = initialUserList[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      emailAddress: initialUser.email,
      forenames: "forename04",
      surname: "surname04",
      orgServes: "orgServes 04",
      groups: [initialGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const result = await updateUser(connection, fakeAuditLogger, currentUser, user)
    expect(result).toBeUndefined()

    const initialUser02 = (await selectFromTable("users", "email", emailAddress))[0]

    expect(initialUser02.id).toBe(initialUser.id)
    expect(initialUser02.username).toBe("Bichard02")
    expect(initialUser02.email).toBe("bichard02@example.com")
    expect(initialUser02.forenames).toBe("forename04")
    expect(initialUser02.surname).toBe("surname04")
    expect(initialUser02.endorsed_by).toBe("endorsed_by 02")
    expect(initialUser02.org_serves).toBe("orgServes 04")
    expect(initialUser02.visible_forces).toBe("004,007,")
    expect(initialUser02.visible_courts).toBe("B02,")
    expect(initialUser02.excluded_triggers).toBe("TRPR0002,")
  })

  it("should update user successfully when called even if they have whitespaces at ends", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    await insertUserWithGroup()
    const emailAddress = "bichard02@example.com"
    const initialUserList = await selectFromTable("users", "email", emailAddress)
    const initialUser = initialUserList[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      emailAddress: initialUser.email,
      forenames: "forename04 ",
      surname: " surname04",
      orgServes: " orgServes 04 ",
      groups: [initialGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const result = await updateUser(connection, fakeAuditLogger, currentUser, user)
    expect(result).toBeUndefined()

    const initialUser02 = (await selectFromTable("users", "email", emailAddress))[0]

    expect(initialUser02.id).toBe(initialUser.id)
    expect(initialUser02.username).toBe("Bichard02")
    expect(initialUser02.email).toBe("bichard02@example.com")
    expect(initialUser02.forenames).toBe("forename04")
    expect(initialUser02.surname).toBe("surname04")
    expect(initialUser02.endorsed_by).toBe("endorsed_by 02")
    expect(initialUser02.org_serves).toBe("orgServes 04")
    expect(initialUser02.visible_forces).toBe("004,007,")
    expect(initialUser02.visible_courts).toBe("B02,")
    expect(initialUser02.excluded_triggers).toBe("TRPR0002,")
  })

  it("should update emailAddress if provided in user object", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const updatedEmail = "bichard05@example.com"
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    await insertUserWithGroup()
    const emailAddress = "bichard02@example.com"
    const initialUserList = await selectFromTable("users", "email", emailAddress)
    const initialUser = initialUserList[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const user = {
      id: initialUser.id,
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      emailAddress: updatedEmail,
      groups: [initialGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const result = await updateUser(connection, fakeAuditLogger, currentUser, user)
    expect(result).toBeUndefined()
    const initialUserList02 = await selectFromTable("users", "email", updatedEmail)
    const initialUser02 = initialUserList02[0]

    expect(initialUser02.email).toBe(updatedEmail)
  })

  it("should throw the correct error if user is not found", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    await insertUserWithGroup()
    const expectedError = Error("Error updating user")
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const user = {
      id: 0,
      emailAddress: "bichard01@example.com",
      username: "Bichard04",
      forenames: "forename04",
      surname: "surname04A",
      endorsedBy: "endorsed by 04",
      orgServes: "orgAServes 04",
      groups: [initialGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const result = await updateUser(connection, fakeAuditLogger, currentUser, user)
    expect(isError(expectedError)).toBe(true)

    const actualError = result as Error
    expect(actualError.message).toBe("There was an error while updating the user. Please try again.")
  })

  it("should update the user with the correct group", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]
    const updatedGroup = selectedGroups[3]

    const user = users.filter((u) => u.username === "Bichard02")[0]

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groups: [initialGroup],
      visibleForces: user.visible_forces,
      visibleCourts: user.visible_courts,
      excludedTriggers: user.excluded_triggers
    }

    await createUser(connection, currentUser, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", user.email)
    const initialUser = initialUserList[0]

    const updateUserDetails: any = {
      id: initialUser.id,
      emailAddress: user.email,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endoresed by 01",
      orgServes: "new org serves",
      groups: [updatedGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    updateUserDetails[initialGroup.name] = "yes"

    const updateResult = await updateUser(connection, fakeAuditLogger, currentUser, updateUserDetails)
    expect(isError(updateResult)).toBe(false)

    const expectedUsers = await selectFromTable("users", "email", user.email)
    const expectedUser = expectedUsers[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    const expectedUserGroup = expectedUsersGroups[0]

    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(updatedGroup.id).toBe(expectedUserGroup.group_id)
  })

  it("should not add the user to a group that does not exist", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]

    const greatestPossibleGroupIdPlusOne =
      selectedGroups.reduce((a: any, c: any) => {
        return a + c.id
      }, 0) + 1

    const user = users.filter((u) => u.username === "Bichard02")[0]

    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groups: [initialGroup],
      visibleForces: user.visible_forces,
      visibleCourts: user.visible_courts,
      excludedTriggers: user.excluded_triggers
    }

    await createUser(connection, currentUser, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const initialUser = initialUserList[0]

    const updateUserDetails: any = {
      id: initialUser.id,
      emailAddress: initialUser.email,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endorsed by 01",
      orgServes: "new org serves",
      groups: [{ id: greatestPossibleGroupIdPlusOne, name: "GRP_DoesNotExist" }],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const updateResult = await updateUser(connection, fakeAuditLogger, currentUser, updateUserDetails)
    expect(isError(updateResult)).toBe(false)

    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    expect(expectedUsersGroups).toHaveLength(0)
  })

  it("should delete all previous records in the users_groups table", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const initialGroup = selectedGroups[0]
    const updatedGroup = selectedGroups[3]

    const user = users.filter((u) => u.email === "bichard02@example.com")[0]

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      surname: user.surname,
      endorsedBy: user.endorsed_by,
      orgServes: user.org_serves,
      emailAddress: user.email,
      groups: [initialGroup],
      visibleForces: user.visible_forces,
      visibleCourts: user.visible_courts,
      excludedTriggers: user.excluded_triggers
    }

    await createUser(connection, currentUser, createUserDetails)

    const initialUserList = await selectFromTable("users", "email", user.email)
    const initialUser = initialUserList[0]

    const updateUserDetails = {
      id: initialUser.id,
      emailAddress: user.email,
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endoresed by 01",
      orgServes: "new org serves",
      groups: [updatedGroup],
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,"
    }

    const updateResult = await updateUser(connection, fakeAuditLogger, currentUser, updateUserDetails)
    expect(isError(updateResult)).toBe(false)

    const expectedUser = (await selectFromTable("users", "email", user.email))[0]
    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    expect(expectedUsersGroups).toHaveLength(1)

    const expectedUserGroup = expectedUsersGroups[0]
    expect(expectedUser.id).toBe(expectedUserGroup.user_id)
    expect(updatedGroup.id).toBe(expectedUserGroup.group_id)
  })

  it("should add the user to the group even if current user does not have that group", async () => {
    // Given a user with a group assigned
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable("bichard01@example.com", [groups[0].name])
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]

    const initialUser = (await selectFromTable("users", "username", "Bichard02"))[0]
    const groupToAdd = await selectFromTable("groups", "name", groups[1].name)

    const updateUserDetails: any = {
      id: initialUser.id,
      emailAddress: "bichard1@example.com",
      username: "new-username-01",
      forenames: "new-forenames-01",
      surname: "new-surname-01",
      endorsedBy: "new endorsed by 01",
      orgServes: "new org serves",
      visibleForces: "004,007,",
      visibleCourts: "B02,",
      excludedTriggers: "TRPR0002,",
      groups: groupToAdd
    }

    updateUserDetails[groups[1].name] = "yes"
    // When the current user updates a user
    const updateResult = await updateUser(connection, fakeAuditLogger, currentUser, updateUserDetails)

    // Then the updated user is updates succesfully and only has the groups the current user can assign
    expect(isError(updateResult)).toBe(false)

    const expectedUsersGroups = await selectFromTable("users_groups", "user_id", initialUser.id)
    expect(expectedUsersGroups).toHaveLength(1)

    const expectedUserGroup = expectedUsersGroups[0]
    expect(initialUser.id).toBe(expectedUserGroup.user_id)
    expect(groupToAdd[0].id).toBe(expectedUserGroup.group_id)
  })
})
