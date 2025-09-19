import type { Case, CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import auditCase from "../../services/db/cases/auditCase"
import fetchCase from "../../services/db/cases/fetchCase"
import { createCase } from "../../tests/helpers/caseHelper"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import saveAuditResults from "./saveAuditResults"

jest.mock("../../services/db/cases/auditCase")

const testDatabaseGateway = new End2EndPostgres()
const testLogger = jest.fn() as unknown as FastifyBaseLogger

const mockedAuditCase = auditCase as jest.Mock

let caseObj: Case
let user: User

describe("saveAuditResults", () => {
  const mockAuditQuality = { errorQuality: 1, triggerQuality: 2 }

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    mockedAuditCase.mockImplementation(jest.requireActual("../../services/db/cases/auditCase").default)

    caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })
    user = await createUser(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("saves auditResults successfully", async () => {
    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality)
    expect(isError(result)).toBe(false)

    const updatedResult = (await fetchCase(testDatabaseGateway.readonly, user, caseObj.errorId, testLogger)) as CaseDto
    expect(updatedResult.errorQualityChecked).toBe(1)
    expect(updatedResult.triggerQualityChecked).toBe(2)
  })

  it("returns an error when no audit quality is provided", async () => {
    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, {})

    expect((result as Error).message).toBe("Neither errorQuality nor triggerQuality is provided")
  })

  it("returns an error when the database update fails", async () => {
    mockedAuditCase.mockResolvedValue(Error("Dummy error"))

    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality)

    expect((result as Error).message).toBe("Dummy error")
  })
})
