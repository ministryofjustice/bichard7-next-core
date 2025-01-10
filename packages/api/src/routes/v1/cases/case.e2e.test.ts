import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { OK } from "http-status"

import { VersionedEndpoints } from "../../../endpoints/versionedEndpoints"
import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken, createUsers } from "../../../tests/helpers/userHelper"

describe("/v1/case e2e", () => {
  const endpoint = VersionedEndpoints.V1.Case
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

  it("returns errorLockedByUsername and errorLockedByUserFullName", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db)
    const users: User[] = await createUsers(helper.db, 2)

    const testCase = await createCase(helper.db, { error_locked_by_id: users[0].username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${encodedJwt}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) satisfies CaseDto
    expect(responseJson.errorLockedByUsername).toBe(users[0].username)
    expect(responseJson.errorLockedByUserFullName).toBe("Forename2 Surname2")
  })

  it("returns triggerLockedByUsername and triggerLockedByUserFullName", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.db)
    const users: User[] = await createUsers(helper.db, 2)

    const testCase = await createCase(helper.db, { trigger_locked_by_id: users[0].username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${encodedJwt}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) satisfies CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(users[0].username)
    expect(responseJson.triggerLockedByUserFullName).toBe("Forename2 Surname2")
  })
})
