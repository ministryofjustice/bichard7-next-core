import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { FastifyBaseLogger } from "fastify"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import filter from "./fetchCase"

const testDatabaseGateway = new End2EndPostgres()
const testLogger = jest.fn() as unknown as FastifyBaseLogger

describe("fetchCase", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns an error if the case isn't found", async () => {
    const user = await createUser(testDatabaseGateway)

    const result = await filter(testDatabaseGateway.readonly, user, 0, testLogger)

    expect((result as Error).message).toBe("Case id 0 for user User1 not found")
  })

  it("returns an error if the case isn't in the correct force and court", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: [], visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)

    expect((result as Error).message).toBe("Case id 1 for user User1 not found")
  })

  it("fetches the Case when both court and force match", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["AB"], visibleForces: ["02"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })

  it("fetches the Case when only court matches", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["AB"], visibleForces: ["01"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })

  it("fetches the Case when only force matches", async () => {
    const user = await createUser(testDatabaseGateway, { visibleCourts: ["QW"], visibleForces: ["02"] })
    const caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      orgForPoliceFilter: "02"
    })

    const result = (await filter(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto

    expect(result.errorId).toEqual(caseObj.errorId)
  })
})
