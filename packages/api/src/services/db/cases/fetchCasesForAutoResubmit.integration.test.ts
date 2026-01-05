import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCases } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { fetchCasesForAutoResubmit } from "./fetchCasesForAutoResubmit"

describe("fetchCasesForAutoResubmit integration", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("will return an error for a non Service user", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.GeneralHandler] })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (!isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result.message).toBe("Not a Service User")
  })

  it("will return empty array if Service user", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(0)
  })

  it("will not fetch a Cases if total_pnc_failure_resubmissions is equal 100", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    await createCases(testDatabaseGateway, 1, { 0: { errorReport: "HO100302", totalPncFailureResubmissions: 100 } })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(0)
  })

  it("will fetch a Cases if total_pnc_failure_resubmissions is under 100", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    const [caseRow] = await createCases(testDatabaseGateway, 1, {
      0: { errorReport: "HO100302", totalPncFailureResubmissions: 99 }
    })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(1)

    const caseRowDb = result[0]

    expect(caseRowDb.error_id).toBe(caseRow.errorId)
  })

  it("will fetch a Cases if it is not locked", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    await createCases(testDatabaseGateway, 2, {
      0: { errorLockedById: "user1", errorReport: "HO100302" },
      1: { errorReport: "HO100302" }
    })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(1)
  })

  it("will not fetch a Cases if it is either Resolved or Submitted", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    await createCases(testDatabaseGateway, 3, {
      0: { errorReport: "HO100302", errorStatus: ResolutionStatusNumber.Resolved },
      1: { errorReport: "HO100302", errorStatus: ResolutionStatusNumber.Submitted },
      2: { errorReport: "HO100302" }
    })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(1)
  })

  it("will only fetch cases if the error codes are HO100302 or HO100404", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.Service] })
    await createCases(testDatabaseGateway, 3, {
      0: { errorReport: "HO100302||br7:ArrestSummonsNumber" },
      1: { errorReport: "HO100404||br7:ArrestSummonsNumber" },
      2: { errorReport: "HO100321||br7:ArrestSummonsNumber" }
    })

    const result = await fetchCasesForAutoResubmit(testDatabaseGateway.writable, user)

    if (isError(result)) {
      throw new Error("Should not be an error")
    }

    expect(result).toHaveLength(2)
  })
})
