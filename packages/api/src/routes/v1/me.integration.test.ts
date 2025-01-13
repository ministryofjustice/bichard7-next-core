import type { FastifyInstance } from "fastify"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import build from "../../app"
import { VersionedEndpoints } from "../../endpoints/versionedEndpoints"
import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

describe("/v1/me", () => {
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
      headers: {
        authorization: `Bearer ${encodedJwt}`
      },
      method: "GET",
      url: VersionedEndpoints.V1.Me
    })

    const responseUser = {
      email: user.email,
      forenames: "Forename",
      groups: user.groups,
      surname: "Surname",
      username: user.username
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
