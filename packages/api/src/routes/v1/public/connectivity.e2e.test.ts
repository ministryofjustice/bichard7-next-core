import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status"

import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"

describe("/v1/connectivity e2e", () => {
  const endpoint = V1.Connectivity
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will return the true values for dependencies", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: {
        ["x-connectivity-check-key"]: "test-connectivity-key"
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual({
      database: true
    })
  })

  it("will return unauthorised with wrong API key", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, {
      headers: {
        ["x-connectivity-check-key"]: "wrong-connectivity-key"
      },
      method: "GET"
    })

    expect(response.status).toBe(UNAUTHORIZED)
  })

  it("will return bad request when no API key supplied", async () => {
    const response = await fetch(`${helper.address}${endpoint}`, {
      method: "GET"
    })

    expect(response.status).toBe(BAD_REQUEST)
  })
})
