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
      annotated_msg: "",
      court_reference: "",
      create_ts: "2022-06-30T08:44:03.930Z",
      error_count: 1,
      error_id: 0,
      error_locked_by_id: null,
      error_report: "",
      error_status: 1,
      is_urgent: 0,
      message_id: "",
      msg_received_ts: "2022-06-30T08:44:03.930Z",
      org_for_police_filter: "",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      user_updated_flag: 0
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
