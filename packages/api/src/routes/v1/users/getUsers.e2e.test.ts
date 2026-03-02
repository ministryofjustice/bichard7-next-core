import type { UserList } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "GET"
  }
}

describe("GET /v1/users", () => {
  const endpoint = V1.Users
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

  it("returns list of users", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      username: "supervisor3"
    })

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as UserList
    expect(body.users[0].username).toBe("supervisor3")
  })
})
