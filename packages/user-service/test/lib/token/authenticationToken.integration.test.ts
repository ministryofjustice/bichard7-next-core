/**
 * @jest-environment node
 */

import { v4 as uuidv4 } from "uuid"
import { getUserByUsername } from "useCases"
import { isTokenIdValid, storeTokenId } from "lib/token/authenticationToken"
import type Database from "types/Database"
import type User from "types/User"
import getTestConnection from "../../../testFixtures/getTestConnection"
import deleteFromTable from "../../../testFixtures/database/deleteFromTable"
import selectFromTable from "../../../testFixtures/database/selectFromTable"
import insertIntoUsersAndGroupsTable from "../../../testFixtures/database/insertIntoUsersAndGroupsTable"
import users from "../../../testFixtures/database/data/users"
import groups from "../../../testFixtures/database/data/groups"

describe("authenticationToken", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  describe("storeTokenId()", () => {
    it("should store the correct UUID and user Id in the jwt_id table", async () => {
      await insertIntoUsersAndGroupsTable(users, groups)
      const tokenId = uuidv4()
      const user = (await getUserByUsername(connection, "Bichard01")) as User

      const result = await storeTokenId(connection, user.id, tokenId)
      expect(result).toBeUndefined()

      const selectedJwtIds = await selectFromTable("users", "email", user.emailAddress)
      const selectedJwt = selectedJwtIds[0]

      expect(selectedJwt.jwt_id).toBe(tokenId)
    })
  })

  describe("isTokenIdValid()", () => {
    it("should return false when the token ID is not in the database", async () => {
      const tokenId = uuidv4()
      const isValid = await isTokenIdValid(connection, tokenId)
      expect(isValid).toBe(false)
    })

    it("should return true when the token ID is in the database", async () => {
      await insertIntoUsersAndGroupsTable(users, groups)
      const tokenId = uuidv4()
      const user = (await getUserByUsername(connection, "Bichard01")) as User
      await storeTokenId(connection, user.id, tokenId)

      const isValid = await isTokenIdValid(connection, tokenId)
      expect(isValid).toBe(true)
    })
  })
})
