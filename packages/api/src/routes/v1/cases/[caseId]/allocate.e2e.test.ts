import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "http-status"

import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser, createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string, body: Record<string, unknown> = {}) => {
  return {
    body: JSON.stringify(body),
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

  const getRouteUrl = (caseId: number | string) => V1.CasesAllocate.replace(":caseId", String(caseId))

  it("returns 403 FORBIDDEN if the authenticated user lacks allocate or user listing permissions", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Audit], {
      visibleForces: ["01"]
    })
    const caseObj = await createCase(helper.postgres, { errorLockedById: null })
    const targetUser = await createUser(helper.postgres)

    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}`
    const response = await fetch(
      url,
      defaultRequest(encodedJwt, { allocatedToUserId: targetUser.id, caseType: "exceptions" })
    )

    expect(response.status).toBe(FORBIDDEN)
  })

  it("returns 404 NOT FOUND ERROR if the target user being allocated to does not exist", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const caseObj = await createCase(helper.postgres, { errorLockedById: null })
    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}`

    const response = await fetch(url, defaultRequest(encodedJwt, { allocatedToUserId: 99999, caseType: "exceptions" }))

    expect(response.status).toBe(NOT_FOUND)
  })

  it("returns NOT FOUND ERROR if the target user exists but falls outside the actor's visible forces", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const targetUser = await createUser(helper.postgres, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["02"]
    })

    const caseObj = await createCase(helper.postgres, { errorLockedById: null })
    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}`

    const response = await fetch(
      url,
      defaultRequest(encodedJwt, { allocatedToUserId: targetUser.id, caseType: "exceptions" })
    )

    expect(response.status).toBe(NOT_FOUND)
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

    const url = `${helper.address}${getRouteUrl(caseObj.errorId)}`

    const response = await fetch(
      url,
      defaultRequest(encodedJwt, { allocatedToUserId: targetUser.id, caseType: "exceptions" })
    )

    expect(response.status).toBe(OK)

    const updatedCase = await helper.postgres.writable
      .connection`SELECT * FROM br7own.error_list WHERE error_id = ${caseObj.errorId}`

    expect(updatedCase[0].error_locked_by_id).toBe(targetUser.username)
    expect(updatedCase[0].trigger_locked_by_id).toBeNull()
  })

  it("returns NOT FOUND ERROR if downstream lockAndAuditLog execution fails due to a missing case entry", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    const targetUser = await createUser(helper.postgres, {
      groups: [UserGroup.GeneralHandler],
      visibleForces: ["01"]
    })

    const url = `${helper.address}${getRouteUrl(88888)}`

    const response = await fetch(
      url,
      defaultRequest(encodedJwt, { allocatedToUserId: targetUser.id, caseType: "exceptions" })
    )

    expect(response.status).toBe(NOT_FOUND)
  })

  it("returns 400 BAD REQUEST ERROR if caseId is not a number", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Allocator, UserGroup.Supervisor], {
      visibleForces: ["01"]
    })

    await createCase(helper.postgres, { errorLockedById: null })

    const url = `${helper.address}${getRouteUrl("not-a-number")}`

    const response = await fetch(url, defaultRequest(encodedJwt, { allocatedToUserId: 12345, caseType: "exceptions" }))

    expect(response.status).toBe(BAD_REQUEST)
  })
})
