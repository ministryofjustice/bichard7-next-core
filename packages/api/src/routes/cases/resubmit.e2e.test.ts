import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type { FastifyInstance } from "fastify"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import { createCase } from "../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({
      phase: 1
    })
  }
}

describe("/cases/:caseId/resubmit e2e", () => {
  const endpoint = "/cases/:caseId/resubmit"
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.dataStoreGateway.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.dataStoreGateway.close()
  })

  it("will receive a 400 error if there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.dataStoreGateway)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(BAD_REQUEST)
  })

  it("will receive a 400 error if there's a case found and not with the users force", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.dataStoreGateway)
    await createCase(helper.dataStoreGateway, { org_for_police_filter: "002" })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 400 error if there's a case found and the user doesn't have the correct permission", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.dataStoreGateway, [UserGroup.TriggerHandler])
    await createCase(helper.dataStoreGateway)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the user doesn't have the error lock", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.dataStoreGateway, [UserGroup.GeneralHandler])
    await createCase(helper.dataStoreGateway)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is resolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.dataStoreGateway, [UserGroup.GeneralHandler])
    await createCase(helper.dataStoreGateway, {
      error_locked_by_id: user.username,
      resolution_ts: new Date().toDateString()
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is submitted", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.dataStoreGateway, [UserGroup.GeneralHandler])
    await createCase(helper.dataStoreGateway, { error_locked_by_id: user.username, error_status: 3 })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 200 error if there's a case found and the case is locked by the user", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.dataStoreGateway, [UserGroup.GeneralHandler])
    await createCase(helper.dataStoreGateway, { error_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual({ phase: 1 })
  })
})
