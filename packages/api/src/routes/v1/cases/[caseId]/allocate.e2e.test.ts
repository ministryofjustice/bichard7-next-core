import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from "http-status"

import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser, createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    body: JSON.stringify({}),
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    method: "PUT"
  }
}

describe("PUT /v1/cases/:caseId/allocate", () => {
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

  const getRouteUrl = (caseId: number) => V1.CasesAllocate.replace(":caseId", String(caseId))

  it("returns 403 FORBIDDEN if the authenticated user lacks allocate or user listing permissions", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Audit], {
      visibleForces: ["01"]
    })
    const caseObj = await createCase(helper.postgres, { errorLockedById: null })

    const targetUser = await createUser(helper.postgres)

    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}?allocatedToUserId=${targetUser.id}&caseType=exceptions`
    const response = await fetch(url, defaultRequest(encodedJwt))
    console.log(response)

    expect(response.status).toBe(FORBIDDEN)
  })

  it("returns 500 INTERNAL SERVER ERROR if the target user being allocated to does not exist", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const caseObj = await createCase(helper.postgres, { errorLockedById: null })
    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}?allocatedToUserId=99999&caseType=exceptions`

    const response = await fetch(url, defaultRequest(encodedJwt))

    expect(response.status).toBe(INTERNAL_SERVER_ERROR)
  })

  it("returns 500 INTERNAL SERVER ERROR if the target user exists but falls outside the actor's visible forces", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const targetUser = await createUser(helper.postgres, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["02"]
    })

    const caseObj = await createCase(helper.postgres, { errorLockedById: null })
    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}?allocatedToUserId=${targetUser.id}&caseType=exceptions`

    const response = await fetch(url, defaultRequest(encodedJwt))

    expect(response.status).toBe(INTERNAL_SERVER_ERROR)
  })

  it("returns 200 OK and successfully modifies the database exception lock parameters on success", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      username: "allocating_Allocator",
      visibleForces: ["01"]
    })

    const targetUser = await createUser(helper.postgres, {
      groups: [UserGroup.GeneralHandler],
      username: "allocated_handler",
      visibleForces: ["01"]
    })

    const caseObj = await createCase(helper.postgres, {
      errorLockedById: null,
      triggerLockedById: null
    })

    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}?allocatedToUserId=${targetUser.id}&caseType=exceptions`

    const response = await fetch(url, defaultRequest(encodedJwt))

    expect(response.status).toBe(OK)
    const textBody = await response.text()
    expect(textBody).toBe("true")

    const updatedCase = await helper.postgres.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`

    expect(updatedCase[0].error_locked_by_id).toBe(targetUser.username)
    expect(updatedCase[0].trigger_locked_by_id).toBeNull()
  })

  it("returns 500 INTERNAL SERVER ERROR if downstream lockAndAuditLog execution fails due to a missing case entry", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const targetUser = await createUser(helper.postgres, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["01"]
    })

    const url = `${helper.address}${getRouteUrl(88888)}?allocatedToUserId=${targetUser.id}&caseType=exceptions`

    const response = await fetch(url, defaultRequest(encodedJwt))

    expect(response.status).toBe(INTERNAL_SERVER_ERROR)
  })
})
