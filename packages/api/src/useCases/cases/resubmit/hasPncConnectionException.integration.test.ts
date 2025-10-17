import mapCaseToCaseRow from "../../../services/db/mapCaseToCaseRow"
import H0100314 from "../../../tests/fixtures/HO100314.json"
import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { hasPncConnectionException } from "./hasPncConnectionException"

describe("hasPncConnectionException", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("be false without any PNC errors", async () => {
    const caseRow = mapCaseToCaseRow(await createCase(testDatabaseGateway))

    const result = hasPncConnectionException(caseRow)

    expect(result).toBe(false)
  })

  it("returns false if it cannot parse the AHO", async () => {
    const caseRow = mapCaseToCaseRow(await createCase(testDatabaseGateway, { aho: "Not XML" }))

    const result = hasPncConnectionException(caseRow)

    expect(result).toBe(false)
  })

  it("returns false if an AHO does contain PncException with wrong error HO100314", async () => {
    const caseRow = mapCaseToCaseRow(await createCase(testDatabaseGateway, { aho: H0100314.hearingOutcomeXml }))

    const result = hasPncConnectionException(caseRow)

    expect(result).toBe(false)
  })

  it("returns true if an AHO does contain PncException with the right message HO100404", async () => {
    const caseRow = mapCaseToCaseRow(await createCase(testDatabaseGateway, { aho: HO100404.hearingOutcomeXml }))

    const result = hasPncConnectionException(caseRow)

    expect(result).toBe(true)
  })
})
