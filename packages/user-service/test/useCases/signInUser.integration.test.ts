import type { IncomingMessage } from "http"
import { ServerResponse } from "http"
import type Database from "types/Database"
import { isError } from "types/Result"
import type User from "types/User"
import createUser from "useCases/createUser"
import signInUser from "useCases/signInUser"
import groups from "../../testFixtures/database/data/groups"
import users from "../../testFixtures/database/data/users"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("SigninUser", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should store authentication token in cookies and DB", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id
    const selectedGroup = (await selectFromTable("groups", undefined, undefined, "name"))[0]
    const user = {
      emailAddress: "dummy@dummy.com",
      username: "dummy_username",
      forenames: "dummyF",
      endorsedBy: "dummyE",
      surname: "dummyS",
      orgServes: "dummyO",
      groupId: selectedGroup.id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      groups: [],
      excludedTriggers: "TRPR0001,",
      featureFlags: { httpsRedirect: true }
    } as Partial<User>

    const userCreateResult = await createUser(connection, { id: currentUserId, username: "Bichard01" }, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", "username", user.username)
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)
    expect(authenticationToken).toMatch(/.+\..+\..+/)
    const cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    expect(cookieValues[0]).toMatch(/.AUTH=.+\..+\..+; HttpOnly/)

    const checkDbQuery = `
      SELECT *
      FROM br7own.users
      WHERE username = $\{username\}
        AND jwt_id IS NOT NULL
    `
    const queryResult = await connection.oneOrNone(checkDbQuery, { username: user.username })
    expect(queryResult).not.toBeNull()
  })
})
