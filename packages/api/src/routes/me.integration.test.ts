import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import build from "../app"
import FakeDataStoreGateway from "../services/gateways/dataStoreGateways/fakeDataStoreGateway"
import { generateJwtForStaticUser } from "../tests/helpers/userHelper"

describe("/me", () => {
  const dataSourceGateway = new FakeDataStoreGateway()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build(dataSourceGateway)
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
    const spy = jest.spyOn(dataSourceGateway, "fetchUserByUsername")
    spy.mockResolvedValue(user)

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${encodedJwt}`
      }
    })

    const responseUser = {
      username: user.username,
      email: user.email,
      groups: user.groups
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
