import type { Case, CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import auditCase from "../../services/db/cases/auditCase"
import fetchCase from "../../services/db/cases/fetchCase"
import { createCase } from "../../tests/helpers/caseHelper"
import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import saveAuditResults from "./saveAuditResults"

jest.mock("../../services/db/cases/auditCase")

const testDatabaseGateway = new End2EndPostgres()
const logger = new FakeLogger()

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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("saves auditResults successfully", async () => {
    jest.restoreAllMocks()

    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality)
    expect(isError(result)).toBe(false)

    const updatedCase = (await fetchCase(testDatabaseGateway.readonly, user, caseObj.errorId, logger)) as CaseDto
    expect(updatedCase.errorQualityChecked).toBe(1)
    expect(updatedCase.triggerQualityChecked).toBe(2)
  })

  it("returns an error when no audit quality is provided", async () => {
    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, {})

    expect((result as Error).message).toBe("Neither errorQuality nor triggerQuality is provided")
  })

  it("returns an error when the database update fails", async () => {
    mockedAuditCase.mockResolvedValue(false)

    const result = await saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality)

    expect((result as Error).message).toBe("Audit results could not be saved")
  })
})
