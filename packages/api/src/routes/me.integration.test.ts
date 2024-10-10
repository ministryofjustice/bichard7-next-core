import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import build from "../app"
import FakeGateway from "../services/gateways/fakeGateway"
import { generateJwtForStaticUser } from "../tests/helpers/userHelper"

describe("/me", () => {
  const gateway = new FakeGateway()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build(gateway)
    await app.ready()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it("will return the current user with a correct JWT", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    const spy = jest.spyOn(gateway, "fetchUserByUsername")
    spy.mockResolvedValue(user)

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        "X-API-Key": "password",
        authorization: `Bearer ${encodedJwt}`
      }
    })

    const responseUser = {
      username: user.username,
      groups: user.groups
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
