import type { AuditDto } from "@moj-bichard7/common/types/Audit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subWeeks } from "date-fns"

import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { getAudit } from "./getAudit"
import { insertAudit } from "./insertAudit"

const testDatabaseGateway = new End2EndPostgres()

describe("getAudit", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  it("Gets audit", async () => {
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

    const retrievedAudit = await getAudit(testDatabaseGateway.writable, (audit as AuditDto).auditId, user)

    expect(isError(retrievedAudit)).toBe(false)
    expect((retrievedAudit as AuditDto).auditId).toBe((audit as AuditDto).auditId)
  })

  it("Fails to get audit for another user", async () => {
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

    const retrievedAudit = await getAudit(testDatabaseGateway.writable, (audit as AuditDto).auditId, {
      ...user,
      username: "another_user"
    })

    expect(isError(retrievedAudit)).toBe(false)
    expect(retrievedAudit).toBeNull()
  })
})
