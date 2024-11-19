import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import build from "../app"
import FakeDataStore from "../services/gateways/dataStoreGateways/fakeDataStore"
import { generateJwtForStaticUser } from "../tests/helpers/userHelper"

describe("/me", () => {
  const db = new FakeDataStore()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build({ db })
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
    const spy = jest.spyOn(db, "fetchUserByUsername")
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
