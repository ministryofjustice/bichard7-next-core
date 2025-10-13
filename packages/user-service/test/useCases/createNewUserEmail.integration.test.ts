/**
 * @jest-environment node
 */

import type Database from "types/Database"
import type EmailContent from "types/EmailContent"
import { isError } from "types/Result"
import createNewUserEmail from "useCases/createNewUserEmail"
import createUser from "useCases/createUser"
import groups from "../../testFixtures/database/data/groups"
import users from "../../testFixtures/database/data/users"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("AccountSetup", () => {
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

  it("should generate the email subject and body to request user to setup password", async () => {
    const username = "Bichard02"
    await insertIntoUsersTable(users.filter((u) => u.username !== username))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id

    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]

    const user = users
      .filter((u) => u.username === "Bichard02")
      .map((u) => ({
        username: u.username,
        forenames: u.forenames,
        emailAddress: u.email,
        endorsedBy: u.endorsed_by,
        surname: u.surname,
        orgServes: u.org_serves,
        groups: [selectedGroup],
        visibleForces: "001,004,",
        visibleCourts: "B01,B41ME00",
        excludedTriggers: "TRPR0001",
        featureFlags: { httpsRedirect: true }
      }))[0]

    const result = await createUser(connection, { id: currentUserId, username: "Bichard01" }, user)

    expect(isError(result)).toBe(false)

    const newUserEmailResult = createNewUserEmail(user, "http://localhost:3000")
    expect(isError(newUserEmailResult)).toBe(false)

    const email = newUserEmailResult as EmailContent
    expect(email.subject).toMatchSnapshot()
    expect(email.text).toMatchSnapshot()
    expect(email.html).toMatchSnapshot()
  })
})
