import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subDays, subWeeks } from "date-fns"

import type { CasesToAuditByUser } from "./getCasesToAudit"

import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { getCasesToAudit } from "./getCasesToAudit"

const testDatabaseGateway = new End2EndPostgres()

describe("getCasesToAudit", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should return all cases when not including triggers and exceptions", async () => {
    const username = "user1"
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        errorId: 1,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: username
      }),
      createCase(testDatabaseGateway, {
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: username
      })
    ])

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      resolvedByUsers: [username],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const casesToAudit = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit).toHaveLength(1)
    expect((casesToAudit as CasesToAuditByUser[])[0].username).toBe(username)
    expect((casesToAudit as CasesToAuditByUser[])[0].caseIds).toEqual(cases.map((row) => row.errorId))
  })

  it("should return a single case when only cases with resolved triggers are asked for", async () => {
    const username = "user1"
    const expectedCase = await createCase(testDatabaseGateway, {
      errorId: 1,
      triggerResolvedAt: subDays(new Date(), 1),
      triggerResolvedBy: username
    })
    await createCase(testDatabaseGateway, {
      errorId: 2,
      errorResolvedAt: subDays(new Date(), 1),
      errorResolvedBy: username
    })

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers"],
      resolvedByUsers: [username],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const casesToAudit = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit).toHaveLength(1)
    expect((casesToAudit as CasesToAuditByUser[])[0].username).toBe(username)
    expect((casesToAudit as CasesToAuditByUser[])[0].caseIds).toEqual([expectedCase.errorId])
  })

  it("should return a single case when only cases with resolved exceptions are asked for", async () => {
    const username = "user1"
    await createCase(testDatabaseGateway, {
      errorId: 1,
      triggerResolvedAt: subDays(new Date(), 1),
      triggerResolvedBy: username
    })
    const expectedCase = await createCase(testDatabaseGateway, {
      errorId: 2,
      errorResolvedAt: subDays(new Date(), 1),
      errorResolvedBy: username
    })

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Exceptions"],
      resolvedByUsers: [username],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const casesToAudit = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit).toHaveLength(1)
    expect((casesToAudit as CasesToAuditByUser[])[0].username).toBe(username)
    expect((casesToAudit as CasesToAuditByUser[])[0].caseIds).toEqual([expectedCase.errorId])
  })

  it("should return only cases for the specified user", async () => {
    const username = "user1"
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        errorId: 1,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: username
      }),
      createCase(testDatabaseGateway, {
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "another_user"
      })
    ])

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      resolvedByUsers: [username],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const casesToAudit = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit).toHaveLength(1)
    expect((casesToAudit as CasesToAuditByUser[])[0].username).toBe(username)
    expect((casesToAudit as CasesToAuditByUser[])[0].caseIds).toEqual([cases[0].errorId])
  })

  it("should return cases for multiple users", async () => {
    const username = "user1"
    const anotherUsername = "user2"
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        errorId: 1,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: username
      }),
      createCase(testDatabaseGateway, {
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: anotherUsername
      }),
      createCase(testDatabaseGateway, {
        errorId: 3,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "excluded_user"
      })
    ])

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      resolvedByUsers: [username, anotherUsername],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const casesToAudit = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit).toHaveLength(2)
    expect((casesToAudit as CasesToAuditByUser[])[0].username).toBe(username)
    expect((casesToAudit as CasesToAuditByUser[])[0].caseIds).toEqual([cases[0].errorId])
    expect((casesToAudit as CasesToAuditByUser[])[1].username).toBe(anotherUsername)
    expect((casesToAudit as CasesToAuditByUser[])[1].caseIds).toEqual([cases[1].errorId])
  })
})
