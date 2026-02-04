import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError } from "@moj-bichard7/common/types/Result"
import { format, subDays, subWeeks } from "date-fns"

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

  it("should return a single case when just 1 trigger handler asked for", async () => {
    const createdCase = await createCase(testDatabaseGateway, {
      triggerResolvedAt: subDays(new Date(), 1),
      triggerResolvedBy: "user1"
    })

    const createAudit = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers"],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const cases = await getCasesToAudit(testDatabaseGateway.writable, createAudit)

    expect(isError(cases)).toBe(false)
    expect(cases).toHaveLength(1)
    expect((cases as number[])[0]).toBe(createdCase.errorId)
  })
})
