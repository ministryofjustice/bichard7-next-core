import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { format, subDays, subWeeks } from "date-fns"

import type { CasesToAuditByUser } from "../../../types/CasesToAuditByUser"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../tests/helpers/triggerHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { getPotentialCasesToAudit } from "./getPotentialCasesToAudit"

const testDatabaseGateway = new End2EndPostgres()

const testUsername = "user1"
const defaultCreateAudit = {
  fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
  includedTypes: ["Triggers", "Exceptions"],
  resolvedByUsers: [testUsername],
  toDate: format(new Date(), "yyyy-MM-dd"),
  volumeOfCases: 20
} satisfies CreateAudit

describe("getPotentialCasesToAudit", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should return all cases when including triggers and exceptions", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: cases.map((row) => row.errorId),
        username: testUsername
      }
    ])
  })

  it("should return a single case when only cases with resolved triggers are asked for", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit,
      includedTypes: ["Triggers"]
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      }
    ])
  })

  it("should return a single case when only cases with resolved exceptions are asked for", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit,
      includedTypes: ["Exceptions"]
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[1].errorId],
        username: testUsername
      }
    ])
  })

  it("should return only cases for the specified user", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "another_user",
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      }
    ])
  })

  it("should return cases for multiple users", async () => {
    const user = await createUser(testDatabaseGateway)
    const anotherUsername = "user2"
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: anotherUsername,
        orgForPoliceFilter: user.visibleForces[0]
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 3,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "excluded_user",
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit,
      resolvedByUsers: [testUsername, anotherUsername]
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      },
      {
        caseIds: [cases[1].errorId],
        username: anotherUsername
      }
    ])
  })

  it("should return only cases for courts the user has access to", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: "XYZ",
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      }
    ])
  })

  it("should return only cases for forces the user has access to", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: "XYZ"
      })
    ])
    const createAudit = {
      ...defaultCreateAudit
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      }
    ])
  })

  it("should return only cases with triggers in the included triggers", async () => {
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
    await Promise.all([
      createTriggers(testDatabaseGateway, 1, [
        {
          resolvedAt: subDays(new Date(), 1),
          resolvedBy: testUsername,
          status: ResolutionStatusNumber.Resolved,
          triggerCode: TriggerCode.TRPR0001
        }
      ]),
      createTriggers(testDatabaseGateway, 2, [
        {
          resolvedAt: subDays(new Date(), 1),
          resolvedBy: testUsername,
          status: ResolutionStatusNumber.Resolved,
          triggerCode: TriggerCode.TRPR0017
        }
      ])
    ])
    const createAudit = {
      ...defaultCreateAudit,
      includedTypes: ["Triggers"],
      triggerTypes: [TriggerCode.TRPR0001]
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0].errorId],
        username: testUsername
      }
    ])
  })

  it("should return only cases when in the requested date range", async () => {
    const user = await createUser(testDatabaseGateway)
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 3,
        orgForPoliceFilter: user.visibleForces[0],
        triggerResolvedAt: subDays(new Date(), 100),
        triggerResolvedBy: testUsername
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 4,
        errorResolvedAt: subDays(new Date(), 100),
        errorResolvedBy: testUsername,
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const createAudit = {
      ...defaultCreateAudit
    } satisfies CreateAudit

    const casesToAudit = await getPotentialCasesToAudit(testDatabaseGateway.writable, createAudit, user)

    expect(isError(casesToAudit)).toBe(false)
    expect(casesToAudit as CasesToAuditByUser[]).toEqual([
      {
        caseIds: [cases[0], cases[1]].map((row) => row.errorId),
        username: testUsername
      }
    ])
  })
})
