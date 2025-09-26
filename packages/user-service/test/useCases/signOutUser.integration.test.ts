/**
 * @jest-environment node
 */

import { IncomingMessage, ServerResponse } from "http"
import config from "lib/config"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import Database from "types/Database"
import { isError } from "types/Result"
import User from "types/User"
import { signInUser, signOutUser } from "useCases"
import createUser from "useCases/createUser"
import groups from "../../testFixtures/database/data/groups"
import users from "../../testFixtures/database/data/users"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("SignoutUser", () => {
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

  it("should expire the authentication cookie", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const user = {
      emailAddress: "dummy@dummy.com",
      username: "dummy_username",
      forenames: "dummyF",
      endorsedBy: "dummyE",
      surname: "dummyS",
      orgServes: "dummyO",
      groupId: selectedGroups[0].id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,",
      featureFlags: { httpsRedirect: true }
    } as unknown as User

    const userCreateResult = await createUser(connection, { id: currentUserId, username: "Bichard01" }, user)
    expect(isError(userCreateResult)).toBe(false)

    const selectedUsers = await selectFromTable("users", "username", user.username)
    const response = new ServerResponse({} as IncomingMessage)
    const authenticationToken = await signInUser(connection, response, selectedUsers[0])
    expect(isError(authenticationToken)).toBe(false)

    expect(authenticationToken).toMatch(/.+\..+\..+/)
    let cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)
    const regex = new RegExp(`^${config.authenticationCookieName}=[^;]+;`)
    expect(cookieValues[0]).toMatch(regex)

    const checkDbQuery = `
      SELECT *
      FROM br7own.users
      WHERE username = $\{username\}
        AND jwt_id IS NOT NULL;
    `

    let queryResult = await connection.oneOrNone(checkDbQuery, { username: user.username })
    expect(queryResult).not.toBe(null)

    const request = <IncomingMessage & { cookies: NextApiRequestCookies }>{ method: "GET" }
    request.cookies = { [config.authenticationCookieName]: authenticationToken as string }

    const signoutUserResult = await signOutUser(connection, response, request)
    expect(isError(signoutUserResult)).toBe(false)

    cookieValues = response.getHeader("Set-Cookie") as string[]
    expect(cookieValues).toHaveLength(1)

    queryResult = await connection.oneOrNone(checkDbQuery, { username: user.username })
    expect(queryResult).toBe(null)
  })
})
