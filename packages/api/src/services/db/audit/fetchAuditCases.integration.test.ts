import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subWeeks } from "date-fns"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { fetchAuditCases } from "./fetchAuditCases"
import { insertAudit } from "./insertAudit"
import { insertAuditCases } from "./insertAuditCases"

const testDatabaseGateway = new End2EndPostgres()

describe("fetchAuditCases", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  it("Get audit cases", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0]
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
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

    const retrievedAuditCases = await fetchAuditCases(
      testDatabaseGateway.readonly,
      (audit as AuditDto).auditId,
      { maxPerPage: 50, order: "asc", pageNum: 1 },
      user
    )

    expect(isError(retrievedAuditCases)).toBe(false)
    expect(retrievedAuditCases as AuditCasesMetadata).toEqual(
      expect.objectContaining({
        cases: expect.arrayContaining(
          (auditCases as { error_id: number }[]).map((c) =>
            expect.objectContaining({
              errorId: c.error_id
            })
          )
        ),
        maxPerPage: 50,
        pageNum: 1,
        returnCases: 2,
        totalCases: 2
      })
    )
  })

  it("Should still filter cases for by visible forces and courts", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: "XYZ"
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

    const retrievedAuditCases = await fetchAuditCases(
      testDatabaseGateway.readonly,
      (audit as AuditDto).auditId,
      { maxPerPage: 50, order: "asc", pageNum: 1 },
      user
    )

    expect(isError(retrievedAuditCases)).toBe(false)
    expect(retrievedAuditCases as AuditCasesMetadata).toEqual(
      expect.objectContaining({
        cases: expect.arrayContaining([
          expect.objectContaining({
            errorId: 1
          }),
          expect.objectContaining({
            errorId: 2
          })
        ]),
        maxPerPage: 50,
        pageNum: 1,
        returnCases: 2,
        totalCases: 2
      })
    )
  })
})
