import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subWeeks } from "date-fns"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import createAudit from "./createAudit"

const testDatabaseGateway = new End2EndPostgres()

describe("createAudit", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })
    await createUser(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("creates audit and returns it", async () => {
    const payload = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const result = await createAudit(testDatabaseGateway.writable, payload)

    expect(isError(result)).toBe(false)
    expect((result as AuditDto).auditId).toBeGreaterThan(0)
  })
})
