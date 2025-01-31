import type { FastifyInstance, InjectOptions } from "fastify"

import { FORBIDDEN, OK } from "http-status"

import build from "../../../app"
import { V1 } from "../../../endpoints/versionedEndpoints"
import FakeDataStore from "../../../services/gateways/dataStoreGateways/fakeDataStore"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../../services/gateways/dynamo/createAuditLogDynamoDbConfig"
import { testAhoJsonStr } from "../../../tests/helpers/ahoHelper"
import { generateJwtForStaticUser } from "../../../tests/helpers/userHelper"

const defaultInjectParams = (jwt: string, caseId: string): InjectOptions => {
  return {
    headers: {
      authorization: "Bearer {{ token }}".replace("{{ token }}", jwt)
    },
    method: "GET",
    url: V1.Case.replace(":caseId", caseId)
  }
}

describe("retrieve a case", () => {
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

  it("returns a case with response code OK when case exists", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    jest.spyOn(fakeDataStore, "fetchUserByUsername").mockResolvedValue(user)

    const response = await app.inject(defaultInjectParams(encodedJwt, "0"))

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual({
      aho: testAhoJsonStr,
      asn: "",
      canUserEditExceptions: false,
      courtCode: "",
      courtDate: new Date("2022-06-30").toISOString(),
      courtName: "",
      courtReference: "",
      defendantName: "",
      errorId: 0,
      errorLockedByUserFullName: null,
      errorLockedByUsername: null,
      errorReport: "",
      errorStatus: null,
      isUrgent: 0,
      notes: [],
      orgForPoliceFilter: "",
      phase: 1,
      ptiurn: null,
      resolutionTimestamp: null,
      triggerCount: 0,
      triggerLockedByUserFullName: null,
      triggerLockedByUsername: null,
      triggers: [],
      triggerStatus: null,
      updatedHearingOutcome: null
    })
  })

  it("returns response code FORBIDDEN when case doesn't exist", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    jest.spyOn(fakeDataStore, "fetchUserByUsername").mockResolvedValue(user)
    jest.spyOn(fakeDataStore, "fetchCase").mockRejectedValue(new Error("Case not found"))

    const response = await app.inject(defaultInjectParams(encodedJwt, "1"))

    expect(response.statusCode).toBe(FORBIDDEN)
  })
})
