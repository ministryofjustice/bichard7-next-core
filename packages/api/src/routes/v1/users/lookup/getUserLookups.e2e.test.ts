import type { UserLookupList } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken, createUsers } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "GET"
  }
}

describe("GET /v1/users/lookup", () => {
  const endpoint = V1.UsersLookup
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  const createDummyUsers = async () => {
    await createUsers(helper.postgres, 3, {
      0: { forenames: "John", id: 10, surname: "Smith", visibleForces: ["01"] },
      1: { forenames: "Jane", id: 20, surname: "Doe", visibleForces: ["01"] },
      2: { forenames: "Bob", id: 30, surname: "Jones", visibleForces: ["01"] },
      3: { forenames: "Bill", id: 40, surname: "Surname40", visibleForces: ["02"] },
      4: { forenames: "Charlie", id: 50, surname: "Surname50", visibleForces: ["02"] },
      5: { forenames: "Diana", id: 60, surname: "Surname60", visibleForces: ["02"] }
    })
  }

  const expectedLookupOutput = [
    { fullname: "Alice Lastname", id: 40 },
    { fullname: "Bob Jones", id: 30 },
    { fullname: "Jane Doe", id: 20 },
    { fullname: "John Smith", id: 10 }
  ]

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await createDummyUsers()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("returns full list of user lookups when no search criteria provided, and only returns users in the same force", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      id: 40,
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList

    expect(body.users.sort((a, b) => b.id - a.id)).toEqual(expectedLookupOutput)
  })

  it("returns list of user lookups when forename matches", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      id: 40,
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=John`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toEqual([expectedLookupOutput[3]])
  })

  it("returns list of user lookups when surname matches", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      id: 40,
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=Lastname`, defaultRequest(encodedJwt))
    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toEqual([expectedLookupOutput[0]])
  })

  it("returns list of user lookups when username matches", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      id: 40,
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=supervisor3`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList

    expect(body.users).toEqual([expectedLookupOutput[0]])
  })

  it("returns an empty list of user lookups when no matches found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(
      `${helper.address}${endpoint}?usernameOrName=invalidSearchCriteria`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toHaveLength(0)
  })

  it("returns list of user lookups when search fuzzy matches", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      forenames: "Alice",
      id: 40,
      surname: "Lastname",
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const userNameMatchResponse = await fetch(
      `${helper.address}${endpoint}?usernameOrName=erviso`,
      defaultRequest(encodedJwt)
    )

    expect(userNameMatchResponse.status).toBe(OK)
    const userNameMatchBody = (await userNameMatchResponse.json()) as unknown as UserLookupList

    expect(userNameMatchBody.users).toEqual([expectedLookupOutput[0]])

    const surnameMatchResponse = await fetch(
      `${helper.address}${endpoint}?usernameOrName=astname`,
      defaultRequest(encodedJwt)
    )

    expect(surnameMatchResponse.status).toBe(OK)
    const surnameMatchBody = (await surnameMatchResponse.json()) as unknown as UserLookupList

    expect(surnameMatchBody.users).toEqual([expectedLookupOutput[0]])

    const firstNameMatchResponse = await fetch(
      `${helper.address}${endpoint}?usernameOrName=ice`,
      defaultRequest(encodedJwt)
    )

    expect(firstNameMatchResponse.status).toBe(OK)
    const firstNameMatchBody = (await firstNameMatchResponse.json()) as unknown as UserLookupList

    expect(firstNameMatchBody.users).toEqual([expectedLookupOutput[0]])
  })
})
