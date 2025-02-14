import type { UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import build from "../../app"
import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import AuditLogDynamoGateway from "../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../services/gateways/dynamo/createAuditLogDynamoDbConfig"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

describe("/v1/me", () => {
  const fakeDataStore = new FakeDataStore()
  let app: FastifyInstance
  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, dataStore: fakeDataStore })
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
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")
    spy.mockResolvedValue(user)

    const response = await app.inject({ headers: { authorization: `Bearer ${encodedJwt}` }, method: "GET", url: V1.Me })

    const responseUser: UserDto = {
      email: user.email,
      featureFlags: {},
      forenames: "Forename",
      fullname: "Forename Surname",
      groups: user.groups,
      hasAccessTo: { "0": true, "1": true, "2": true, "3": false, "4": false, "5": false, "6": false, "7": true },
      surname: "Surname",
      username: user.username,
      visibleForces: "001"
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
