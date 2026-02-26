import type { CaseOrderBy } from "@moj-bichard7/common/contracts/CaseOrderingQuery"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subDays, subWeeks } from "date-fns"

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

  afterAll(async () => {
    await testDatabaseGateway.close()
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

  describe("Pagination", () => {
    it.each([1, 2])("Page %s", async (pageNum) => {
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
        { maxPerPage: 1, order: "asc", pageNum },
        user
      )

      expect(isError(retrievedAuditCases)).toBe(false)
      expect(retrievedAuditCases as AuditCasesMetadata).toEqual(
        expect.objectContaining({
          cases: expect.arrayContaining([
            expect.objectContaining({
              errorId: pageNum
            })
          ]),
          maxPerPage: 1,
          pageNum,
          returnCases: 1,
          totalCases: 2
        })
      )
    })
  })

  describe("Ordering", () => {
    it.each<CaseOrderBy>(["courtDate", "courtName", "ptiurn", "defendantName", "messageReceivedTimestamp"])(
      "Get audit cases in %s order",
      async (orderBy) => {
        const user = await createUser(testDatabaseGateway)
        const cases = await Promise.all([
          createCase(testDatabaseGateway, {
            courtCode: user.visibleCourts[0],
            courtDate: new Date(),
            courtName: "XYZ",
            defendantName: "XYZ",
            errorId: 1,
            messageReceivedAt: new Date(),
            orgForPoliceFilter: user.visibleForces[0],
            ptiurn: "XYZ"
          }),
          createCase(testDatabaseGateway, {
            courtCode: user.visibleCourts[0],
            courtDate: subDays(new Date(), 1),
            courtName: "ABC",
            defendantName: "ABC",
            errorId: 2,
            messageReceivedAt: subDays(new Date(), 1),
            orgForPoliceFilter: user.visibleForces[0],
            ptiurn: "ABC"
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

        const retrievedAuditCasesAsc = await fetchAuditCases(
          testDatabaseGateway.readonly,
          (audit as AuditDto).auditId,
          { maxPerPage: 50, order: "asc", orderBy, pageNum: 1 },
          user
        )

        expect(isError(retrievedAuditCasesAsc)).toBe(false)
        expect((retrievedAuditCasesAsc as AuditCasesMetadata).cases).toMatchObject([
          expect.objectContaining({ errorId: 2 }),
          expect.objectContaining({ errorId: 1 })
        ])

        const retrievedAuditCasesDesc = await fetchAuditCases(
          testDatabaseGateway.readonly,
          (audit as AuditDto).auditId,
          { maxPerPage: 50, order: "desc", orderBy, pageNum: 1 },
          user
        )

        expect(isError(retrievedAuditCasesDesc)).toBe(false)
        expect((retrievedAuditCasesDesc as AuditCasesMetadata).cases).toMatchObject([
          expect.objectContaining({ errorId: 1 }),
          expect.objectContaining({ errorId: 2 })
        ])
      }
    )
  })
})
