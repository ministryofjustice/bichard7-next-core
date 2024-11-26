import type { FastifyInstance } from "fastify"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import { createCase } from "../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    body: JSON.stringify({
      phase: 1
    }),
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    method: "POST"
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
    await helper.db.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.db.close()
  })

  it("will receive a 400 error if there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(BAD_REQUEST)
  })

  it("will receive a 400 error if there's a case found and not with the users force", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db)
    await createCase(helper.db, { org_for_police_filter: "002" })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 400 error if there's a case found and the user doesn't have the correct permission", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db, [UserGroup.TriggerHandler])
    await createCase(helper.db)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the user doesn't have the error lock", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db, [UserGroup.GeneralHandler])
    await createCase(helper.db)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is resolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.db, [UserGroup.GeneralHandler])
    await createCase(helper.db, {
      error_locked_by_id: user.username,
      resolution_ts: new Date().toDateString()
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is submitted", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.db, [UserGroup.GeneralHandler])
    await createCase(helper.db, { error_locked_by_id: user.username, error_status: 3 })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 200 error if there's a case found and the case is locked by the user", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.db, [UserGroup.GeneralHandler])
    await createCase(helper.db, { error_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    expect(await response.json()).toEqual({ phase: 1 })
  })
})
