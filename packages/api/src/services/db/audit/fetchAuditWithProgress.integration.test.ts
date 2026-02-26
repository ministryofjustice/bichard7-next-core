import type { AuditDto, AuditWithProgress } from "@moj-bichard7/common/types/Audit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subDays, subWeeks } from "date-fns"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { fetchAuditWithProgress } from "./fetchAuditWithProgress"
import { insertAudit } from "./insertAudit"
import { insertAuditCases } from "./insertAuditCases"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchAuditWithProgress", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("Get audit with progress", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerQualityChecked: 2,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: "user1"
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "user1",
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
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

    const auditCases = await insertAuditCases(
      testDatabaseGateway.writable,
      (audit as AuditDto).auditId,
      cases.map((c) => c.errorId)
    )
    expect(isError(auditCases)).toBe(false)

    const auditWithProgress = await fetchAuditWithProgress(
      testDatabaseGateway.readonly,
      (audit as AuditDto).auditId,
      user
    )

    expect(isError(auditWithProgress)).toBe(false)
    expect(auditWithProgress as AuditWithProgress).toEqual(
      expect.objectContaining({
        audit_id: (audit as AuditDto).auditId,
        audited_cases: 1,
        completed_when: null,
        created_by: user.username,
        created_when: expect.any(Date),
        from_date: expect.any(Date),
        included_types: ["Triggers", "Exceptions"],
        resolved_by_users: ["user1"],
        to_date: expect.any(Date),
        total_cases: 2,
        trigger_types: null,
        volume_of_cases: 20
      })
    )
  })

  it("Should still filter cases for by visible forces and courts", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: "XYZ",
        triggerQualityChecked: 2
      }),
      createCase(testDatabaseGateway, {
        courtCode: "XYZ",
        errorId: 2,
        orgForPoliceFilter: user.visibleForces[0]
      }),
      createCase(testDatabaseGateway, {
        courtCode: "XYZ",
        errorId: 3,
        orgForPoliceFilter: "XYZ"
      }),
      createCase(testDatabaseGateway, {
        courtCode: "XYZ",
        errorId: 4,
        orgForPoliceFilter: "XYZ"
      })
    ])
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

    const auditCases = await insertAuditCases(
      testDatabaseGateway.writable,
      (audit as AuditDto).auditId,
      cases.map((c) => c.errorId)
    )
    expect(isError(auditCases)).toBe(false)

    const auditWithProgress = await fetchAuditWithProgress(
      testDatabaseGateway.readonly,
      (audit as AuditDto).auditId,
      user
    )

    expect(isError(auditWithProgress)).toBe(false)
    expect(auditWithProgress as AuditWithProgress).toEqual(
      expect.objectContaining({
        audit_id: (audit as AuditDto).auditId,
        audited_cases: 1,
        completed_when: null,
        created_by: user.username,
        created_when: expect.any(Date),
        from_date: expect.any(Date),
        included_types: ["Triggers", "Exceptions"],
        resolved_by_users: ["user1"],
        to_date: expect.any(Date),
        total_cases: 2,
        trigger_types: null,
        volume_of_cases: 20
      })
    )
  })
})
