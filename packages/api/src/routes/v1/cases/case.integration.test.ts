import type { FastifyInstance, InjectOptions } from "fastify"

import { FORBIDDEN, OK } from "http-status"

import build from "../../../app"
import { VersionedEndpoints } from "../../../endpoints/versionedEndpoints"
import FakeDataStore from "../../../services/gateways/dataStoreGateways/fakeDataStore"
import { generateJwtForStaticUser } from "../../../tests/helpers/userHelper"

const defaultInjectParams = (jwt: string, caseId: string): InjectOptions => {
  return {
    headers: {
      authorization: "Bearer {{ token }}".replace("{{ token }}", jwt)
    },
    method: "GET",
    url: VersionedEndpoints.V1.Case.replace(":caseId", caseId)
  }
}

describe("retrieve a case", () => {
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

  it("returns a case with response code OK when case exists", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    jest.spyOn(db, "fetchUserByUsername").mockResolvedValue(user)

    const response = await app.inject(defaultInjectParams(encodedJwt, "0"))

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual({
      aho: "",
      asn: "",
      canUserEditExceptions: undefined,
      courtCode: "",
      courtDate: new Date("2022-06-30").toISOString(),
      courtName: "",
      courtReference: "",
      defendantName: "",
      errorId: 0,
      errorLockedByUserFullName: undefined,
      errorLockedByUsername: null,
      errorReport: "",
      errorStatus: null,
      isUrgent: 0,
      orgForPoliceFilter: "",
      phase: 1,
      ptiurn: null,
      resolutionTimestamp: null,
      triggerCount: 0,
      triggerLockedByUserFullName: undefined,
      triggerLockedByUsername: null,
      triggerStatus: null,
      updatedHearingOutcome: ""
    })
  })

  it("returns response code FORBIDDEN when case doesn't exist", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    jest.spyOn(db, "fetchUserByUsername").mockResolvedValue(user)
    jest.spyOn(db, "fetchFullCase").mockRejectedValue(new Error("Case not found"))

    const response = await app.inject(defaultInjectParams(encodedJwt, "1"))

    expect(response.statusCode).toBe(FORBIDDEN)
  })
})
