import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken, createUsers } from "../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "GET"
  }
}

describe("GET /v1/users/:userId", () => {
  const endpoint = V1.User
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

  it("returns user when valid id is provided", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 123,
      username: "supervisor3"
    })

    const response = await fetch(
      `${helper.address}${endpoint.replace(":userId", String(123))}`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(OK)
    const body = (await response.json()) as unknown as User
    expect(body.username).toBe("supervisor3")
  })

  it("returns error when invalid id is provided", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 123,
      username: "supervisor3"
    })

    const response = await fetch(
      `${helper.address}${endpoint.replace(":userId", String(456))}`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(500)
  })

  it("returns error when requested user is not in visible forces", async () => {
    await createUsers(helper.postgres, 1, {
      0: { forenames: "John", id: 10, surname: "Smith", visibleForces: ["02"] }
    })

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor], {
      id: 123,
      username: "supervisor3",
      visibleForces: ["01"]
    })

    const response = await fetch(
      `${helper.address}${endpoint.replace(":userId", String(10))}`,
      defaultRequest(encodedJwt)
    )

    expect(response.status).toBe(500)
  })
})
