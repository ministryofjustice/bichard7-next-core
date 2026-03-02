import type { AuditDto } from "@moj-bichard7/common/types/Audit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subWeeks } from "date-fns"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { insertAudit } from "./insertAudit"
import { insertAuditCases } from "./insertAuditCases"

const testDatabaseGateway = new End2EndPostgres()

describe("insertAuditCases", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  it("Creates audit cases", async () => {
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 1,
        orgForPoliceFilter: "02"
      }),
      createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 2,
        orgForPoliceFilter: "02"
      }),
      createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 3,
        orgForPoliceFilter: "02"
      })
    ])
    const caseIds = cases.map((row) => row.errorId)
    const user = await createUser(testDatabaseGateway)
    const audit = await insertAudit(
      testDatabaseGateway.writable,
      {
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate: format(new Date(), "yyyy-MM-dd"),
        volumeOfCases: 20
      },
      user
    )
    expect(isError(audit)).toBe(false)

    const auditCases = await insertAuditCases(testDatabaseGateway.writable, (audit as AuditDto).auditId, caseIds)

    expect(isError(auditCases)).toBe(false)
    expect(auditCases).toHaveLength(caseIds.length)
  })
})
