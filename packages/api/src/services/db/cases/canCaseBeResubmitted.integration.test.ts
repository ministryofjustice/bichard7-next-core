import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import canCaseBeResubmitted from "./canCaseBeResubmitted"

const testDatabaseGateway = new End2EndPostgres()

describe("canCaseBeResubmitted", () => {
  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  it("returns an error if the case isn't found", async () => {
    const user = await createUser(testDatabaseGateway)

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, 0)

    expect((result as Error).message).toBe("Case not found")
  })

  it("returns false if case isn't locked by given user", async () => {
    const user = await createUser(testDatabaseGateway)
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: "another-user" })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(false)
  })

  it("returns false if the case does not belong to the same force as the case", async () => {
    const user = await createUser(testDatabaseGateway, { visibleForces: ["02"] })
    const caseObj = await createCase(testDatabaseGateway, { orgForPoliceFilter: "01" })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(false)
  })

  it("returns false if user is locked to the case and case belongs to user's force but case is resolved", async () => {
    const user = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Resolved,
      orgForPoliceFilter: "01"
    })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(false)
  })

  it("returns false if user is locked to the case and case belongs to user's force but case is submitted", async () => {
    const user = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Submitted,
      orgForPoliceFilter: "01"
    })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(false)
  })

  it("returns true if user is locked to the case, case belongs to user's force and case is unresolved", async () => {
    const user = await createUser(testDatabaseGateway, { visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved,
      orgForPoliceFilter: "01"
    })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(true)
  })

  it("returns true if user is not in a visible force but is in visible courts", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["B01,B41ME00"], visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "B01EF01",
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved,
      orgForPoliceFilter: "04CA"
    })

    const result = await canCaseBeResubmitted(testDatabaseGateway.readonly, user, caseObj.errorId)

    expect(result).toBe(true)
  })
})
