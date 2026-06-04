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
  const endpoint = V1.UserLookups
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  const createDummyUsers = async () => {
    await createUsers(helper.postgres, 3, {
      0: { forenames: "Forename10", id: 10, surname: "Surname10" },
      1: { forenames: "Forename20", id: 20, surname: "Surname20" },
      2: { forenames: "Forename30", id: 30, surname: "Surname30" }
    })
  }

  const expectedLookupOutput = [
    { fullname: "Forename30 Surname30", id: 30 },
    { fullname: "Forename10 Surname10", id: 10 },
    { fullname: "Forename40 Surname40", id: 40 },
    { fullname: "Forename20 Surname20", id: 20 }
  ]

  it("returns list of user lookups when forename matches", async () => {
    createDummyUsers()

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 40,
      username: "supervisor3"
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=Forename`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toEqual(expectedLookupOutput)
  })

  it("returns list of user lookups when surname matches", async () => {
    createDummyUsers()

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 40,
      username: "supervisor3"
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=Surname`, defaultRequest(encodedJwt))
    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toEqual(expectedLookupOutput)
  })

  it("returns list of user lookups when username matches", async () => {
    createDummyUsers()

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 40,
      username: "supervisor3"
    })

    const response = await fetch(`${helper.address}${endpoint}?usernameOrName=User`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList

    expect(body.users).toEqual([
      { fullname: "Forename30 Surname30", id: 30 },
      { fullname: "Forename10 Surname10", id: 10 },
      { fullname: "Forename20 Surname20", id: 20 }
    ])
  })

  it("returns an empty list of user lookups when no matches found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      username: "supervisor3"
    })

    const response = await fetch(
      `${helper.address}${endpoint}?usernameOrName=invalidSearchCriteria`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserLookupList
    expect(body.users).toHaveLength(0)
  })
})
