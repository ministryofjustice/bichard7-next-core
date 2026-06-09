import type { FetchUsersResult } from "./fetchUserLookups"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchUserLookups from "./fetchUserLookups"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchUserLookups", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  describe("Visible Forces Filtering", () => {
    it("should return no users if current user has no visible forces", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: [] })
      await createUser(testDatabaseGateway, { visibleForces: ["01"] })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser)) as FetchUsersResult

      expect(result.users).toEqual([])
    })

    it("should only return users within the current user's visible forces when no search term is provided", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const matchingForceUser = await createUser(testDatabaseGateway, { forenames: "Alice", visibleForces: ["01"] })
      const nonMatchingForceUser = await createUser(testDatabaseGateway, { forenames: "Bob", visibleForces: ["02"] })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser)) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(matchingForceUser.id)
      expect(ids).not.toContain(nonMatchingForceUser.id)
    })
  })

  describe("Fuzzy Name/Username Searching", () => {
    it("should perform case-insensitive partial matching on username", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const targetUser = await createUser(testDatabaseGateway, { username: "username", visibleForces: ["01"] })
      const otherUser = await createUser(testDatabaseGateway, { username: "otheruser", visibleForces: ["01"] })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "Username")) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(targetUser.id)
      expect(ids).not.toContain(otherUser.id)
    })

    it("should perform case-insensitive partial matching on forenames and surname", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const matchForenameAndSurname = await createUser(testDatabaseGateway, {
        forenames: "Bob",
        surname: "Smith",
        visibleForces: ["01"]
      })
      const matchSurname = await createUser(testDatabaseGateway, {
        forenames: "Fred",
        surname: "Smithy",
        visibleForces: ["01"]
      })
      const noMatch = await createUser(testDatabaseGateway, {
        forenames: "Harry",
        surname: "Potter",
        visibleForces: ["01"]
      })

      let result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "smi")) as FetchUsersResult
      let ids = result.users.map((u) => u.id)
      expect(ids).toContain(matchForenameAndSurname.id)
      expect(ids).toContain(matchSurname.id)
      expect(ids).not.toContain(noMatch.id)

      result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "bob")) as FetchUsersResult
      ids = result.users.map((u) => u.id)
      expect(ids).toContain(matchForenameAndSurname.id)
      expect(ids).not.toContain(matchSurname.id)
    })

    it("should ignore surrounding white spaces in the search term", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const targetUser = await createUser(testDatabaseGateway, {
        forenames: "Jim",
        surname: "Smith",
        visibleForces: ["01"]
      })

      const result = (await fetchUserLookups(
        testDatabaseGateway.readonly,
        currentUser,
        "   Smith   "
      )) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(targetUser.id)
    })

    it("should treat empty strings or spaces-only as if no search parameter was passed", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      await createUser(testDatabaseGateway, { forenames: "John", visibleForces: ["01"] })
      await createUser(testDatabaseGateway, { forenames: "Bob", visibleForces: ["01"] })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "   ")) as FetchUsersResult

      expect(result.users).toHaveLength(3)
    })

    it("should apply AND operator between force filtering and name filtering", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })

      const rightNameWrongForce = await createUser(testDatabaseGateway, { forenames: "Bob", visibleForces: ["02"] })
      const wrongNameRightForce = await createUser(testDatabaseGateway, { forenames: "Fred", visibleForces: ["01"] })
      const rightNameRightForce = await createUser(testDatabaseGateway, { forenames: "Bob", visibleForces: ["01"] })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "Bob")) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(rightNameRightForce.id)
      expect(ids).not.toContain(rightNameWrongForce.id)
      expect(ids).not.toContain(wrongNameRightForce.id)
    })

    it("should filter out deleted users when no search term is provided", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const targetUser = await createUser(testDatabaseGateway, { username: "username", visibleForces: ["01"] })
      const deletedUser = await createUser(testDatabaseGateway, {
        deletedAt: new Date(),
        username: "otheruser",
        visibleForces: ["01"]
      })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser)) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(targetUser.id)
      expect(ids).not.toContain(deletedUser.id)
    })

    it("should filter out deleted users when search term is provided", async () => {
      const currentUser = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
      const targetUser = await createUser(testDatabaseGateway, { username: "username1", visibleForces: ["01"] })
      const deletedUser = await createUser(testDatabaseGateway, {
        deletedAt: new Date(),
        username: "username2",
        visibleForces: ["01"]
      })

      const result = (await fetchUserLookups(testDatabaseGateway.readonly, currentUser, "username")) as FetchUsersResult

      const ids = result.users.map((u) => u.id)
      expect(ids).toContain(targetUser.id)
      expect(ids).not.toContain(deletedUser.id)
    })
  })
})
