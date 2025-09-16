import type { Case } from "@moj-bichard7/common/types/Case"

import { isError } from "@moj-bichard7/common/types/Result"

import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import auditCase from "./auditCase"

const testDatabaseGateway = new End2EndPostgres()

let caseObj: Case

describe("auditCase", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("updates only errorQuality when provided", async () => {
    const result = await auditCase(testDatabaseGateway.writable, caseObj.errorId, { errorQuality: 1 })

    expect(isError(result)).toBe(false)
    expect(result).toBe(true)
  })

  it("updates only triggerQuality when provided", async () => {
    const result = await auditCase(testDatabaseGateway.writable, caseObj.errorId, { triggerQuality: 2 })

    expect(isError(result)).toBe(false)
    expect(result).toBe(true)
  })

  it("updates both errorQuality and triggerQuality when provided both", async () => {
    const result = await auditCase(testDatabaseGateway.writable, caseObj.errorId, {
      errorQuality: 1,
      triggerQuality: 2
    })

    expect(isError(result)).toBe(false)
    expect(result).toBe(true)
  })

  it("returns false when neither of the quality is provided", async () => {
    const result = await auditCase(testDatabaseGateway.writable, caseObj.errorId, {})

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Neither errorQuality nor triggerQuality is provided")
  })

  it("returns false when caseId doesn't exists", async () => {
    const result = await auditCase(testDatabaseGateway.writable, 2, {})

    expect(isError(result)).toBe(true)
  })
})
