import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { OK } from "http-status"

import fetchCase from "../../../../services/db/cases/fetchCase"
import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string, body: Record<string, unknown>) => {
  return {
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "POST"
  }
}

describe("/v1/cases/:caseId/resolve e2e", () => {
  const endpoint = V1.CaseResolve
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

  // 200 happy path
  // try to resolve case that's already resolved
  // try to resolve case doesn't exist
  // try to resolve case locked to another user
  // try to resolve case with empty request body
  // try to resolve case with invalid request body
  // try to resolve case that belongs to other force

  it("will receive a 200 if the case is found and unresolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.GeneralHandler])
    const caseObj = await createCase(helper.postgres, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    const response = await fetch(
      `${helper.address}${endpoint.replace(":caseId", "1")}`,
      defaultRequest(encodedJwt, {
        reason: "UpdatedDisposal",
        reasonText: "Test comment",
        resolutionStatus: "Resolved"
      })
    )

    expect(response.status).toBe(OK)
    const updatedCase = await fetchCase(helper.postgres.readonly, user, caseObj.errorId, app.log)

    if (isError(updatedCase)) {
      throw updatedCase
    }

    expect(updatedCase.errorStatus).toBe("Resolved")
  })
})
