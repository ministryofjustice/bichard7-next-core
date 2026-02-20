import type { UserDto } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import Permission from "@moj-bichard7/common/types/Permission"
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
    await createUser(testDatabaseGateway, {
      email: user.email,
      forenames: user.forenames,
      groups: user.groups,
      jwtId: user.jwtId,
      surname: user.surname,
      username: user.username
    })

    const response = await app.inject({ headers: { authorization: `Bearer ${encodedJwt}` }, method: "GET", url: V1.Me })

    const responseUser: UserDto = {
      email: user.email,
      excludedTriggers: "",
      featureFlags: {},
      forenames: user.forenames,
      fullname: `${user.forenames} ${user.surname}`,
      groups: user.groups,
      hasAccessTo: {
        [Permission.CanAuditCases]: false,
        [Permission.CanResubmit]: true,
        [Permission.CaseDetailsSidebar]: true,
        [Permission.Exceptions]: true,
        [Permission.ListAllCases]: false,
        [Permission.Triggers]: true,
        [Permission.UnlockOtherUsersCases]: false,
        [Permission.ViewReports]: false,
        [Permission.ViewUserManagement]: false
      },
      surname: user.surname,
      username: user.username,
      visibleCourts: "AB",
      visibleForces: ["01"]
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })

  it("returns the supervisor user with a correct JWT", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.Supervisor])
    await createUser(testDatabaseGateway, {
      email: user.email,
      forenames: user.forenames,
      groups: user.groups,
      jwtId: user.jwtId,
      surname: user.surname,
      username: user.username
    })

    const response = await app.inject({ headers: { authorization: `Bearer ${encodedJwt}` }, method: "GET", url: V1.Me })

    const responseUser: UserDto = {
      email: user.email,
      excludedTriggers: "",
      featureFlags: {},
      forenames: user.forenames,
      fullname: `${user.forenames} ${user.surname}`,
      groups: user.groups,
      hasAccessTo: {
        [Permission.CanAuditCases]: true,
        [Permission.CanResubmit]: true,
        [Permission.CaseDetailsSidebar]: true,
        [Permission.Exceptions]: true,
        [Permission.ListAllCases]: true,
        [Permission.Triggers]: true,
        [Permission.UnlockOtherUsersCases]: true,
        [Permission.ViewReports]: true,
        [Permission.ViewUserManagement]: false
      },
      surname: user.surname,
      username: user.username,
      visibleCourts: "AB",
      visibleForces: ["01"]
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
