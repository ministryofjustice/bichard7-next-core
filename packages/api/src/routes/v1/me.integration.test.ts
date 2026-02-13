import type { UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import build from "../../app"
import AuditLogDynamoGateway from "../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../services/gateways/dynamo/createAuditLogDynamoDbConfig"
import { createUser, generateJwtForStaticUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"

describe("/v1/me", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("returns the current user with a correct JWT", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    await createUser(testDatabaseGateway, { groups: user.groups, jwtId: user.jwtId, username: user.username })

    const response = await app.inject({ headers: { authorization: `Bearer ${encodedJwt}` }, method: "GET", url: V1.Me })

    const responseUser: UserDto = {
      email: user.email,
      excludedTriggers: "",
      featureFlags: {},
      forenames: "Forename1",
      fullname: "Forename1 Surname1",
      groups: user.groups,
      hasAccessTo: {
        "0": true,
        "1": true,
        "2": true,
        "3": false,
        "4": false,
        "5": false,
        "6": false,
        "7": true,
        "8": false
      },
      surname: "Surname1",
      username: user.username,
      visibleCourts: "AB",
      visibleForces: ["01"]
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
