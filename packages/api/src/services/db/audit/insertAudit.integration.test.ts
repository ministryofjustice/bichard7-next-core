import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subWeeks } from "date-fns"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { insertAudit } from "./insertAudit"

const testDatabaseGateway = new End2EndPostgres()

describe("insertAudit", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("creates audit and returns it", async () => {
    const user = await createUser(testDatabaseGateway)
    const payload = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const result = await insertAudit(testDatabaseGateway.writable, payload, user)

    expect(isError(result)).toBe(false)
    expect((result as AuditDto).auditId).toBeGreaterThan(0)
    expect((result as AuditDto).createdBy).toBe(user.username)
    expect((result as AuditDto).toDate).toBe(payload.toDate)
    expect((result as AuditDto).createdBy).toBe(user.username)
  })
})
