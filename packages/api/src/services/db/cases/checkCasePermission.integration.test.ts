import { isError } from "@moj-bichard7/common/types/Result"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import checkCasePermission from "./checkCasePermission"

const testDatabaseGateway = new End2EndPostgres()

describe("checkCasePermission", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    await createCase(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("Returns Not Found error when case doesn't exist", async () => {
    const user = await createUser(testDatabaseGateway)

    const result = await checkCasePermission(testDatabaseGateway.writable, user, 999)

    expect(isError(result)).toBe(true)
  })

  it("Returns successfully when user has access to case's visible court but not force", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["ABC"], visibleForces: ["02"] })

    const result = await checkCasePermission(testDatabaseGateway.writable, user, 1)

    expect(isError(result)).toBe(false)
  })

  it("Returns successfully when user has access to case's visible force but not court", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["DEF"], visibleForces: ["01"] })

    const result = await checkCasePermission(testDatabaseGateway.writable, user, 1)

    expect(isError(result)).toBe(false)
  })

  it("Returns successfully when user has access to case's visible court and force", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["ABC"], visibleForces: ["01"] })

    const result = await checkCasePermission(testDatabaseGateway.writable, user, 1)

    expect(isError(result)).toBe(false)
  })

  it("Returns 404 Not Found when user doesn't have access to case's visible court or force", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["DEF"], visibleForces: ["02"] })

    const result = await checkCasePermission(testDatabaseGateway.writable, user, 1)

    expect(isError(result)).toBe(true)
  })
})
