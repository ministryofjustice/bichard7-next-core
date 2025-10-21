import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { ACCEPTED, FORBIDDEN, NOT_FOUND } from "http-status"

import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import { ResolutionStatusNumber } from "../../../../useCases/dto/convertResolutionStatus"

const defaultRequest = (jwt: string) => {
  return {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "POST"
  }
}

describe("/v1/cases/:caseId/resubmit e2e", () => {
  const endpoint = V1.CaseResubmit
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will receive a 404 error if there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("will receive a 403 error if there's a case found and not with the users force", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    await createCase(helper.postgres, { orgForPoliceFilter: "02" })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the user doesn't have the correct permission", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.TriggerHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the user doesn't have the error lock", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is resolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Resolved,
      resolutionAt: new Date()
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 403 error if there's a case found and the case is submitted", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    await createCase(helper.postgres, { errorLockedById: user.username, errorStatus: ResolutionStatusNumber.Submitted })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will receive a 202 if there's a case found and the case is locked by the user", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    const caseObj = await createCase(helper.postgres, { errorLockedById: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", "1")}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(ACCEPTED)

    const responseJson = await response.json()
    expect(responseJson).toHaveProperty("messageId", caseObj.messageId)
  })
})
