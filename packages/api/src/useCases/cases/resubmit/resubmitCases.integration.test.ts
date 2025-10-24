jest.mock("../../../services/db/cases/incrementPncFailureResubmissions")

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import * as incrementPncFailureResubmissions from "../../../services/db/cases/incrementPncFailureResubmissions"
import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCases } from "../../../tests/helpers/caseHelper"
import { minimalUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { resubmitCases } from "./resubmitCases"

const originalIncrement = jest.requireActual("../../../services/db/cases/incrementPncFailureResubmissions")

describe("resubmitCases", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    jest.clearAllMocks()
    jest.spyOn(incrementPncFailureResubmissions, "default").mockImplementation(originalIncrement.default)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("will return an empty object", async () => {
    const nonSystemUser = minimalUser([UserGroup.Service])

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser)

    if (isError(result)) {
      throw new Error()
    }

    expect(result).toStrictEqual({})
  })

  it("needs the System user", async () => {
    const nonSystemUser = minimalUser([UserGroup.GeneralHandler])
    await createCases(testDatabaseGateway, 3, {
      0: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" },
      1: { aho: HO100404.hearingOutcomeXml, errorCount: 1, errorReport: "HO100404||br7:ArrestSummonsNumber" }
    })

    const result = await resubmitCases(testDatabaseGateway.writable, nonSystemUser)

    if (!isError(result)) {
      throw new Error()
    }

    expect(result.message).toBe("Missing System User")
  })

  it("will successfully resubmit 3 cases", async () => {
    const systemUser = minimalUser([UserGroup.Service], "System")
    const cases = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      1: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      2: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    const result = await resubmitCases(testDatabaseGateway.writable, systemUser)

    if (isError(result)) {
      throw result
    }

    for (const c of cases) {
      expect(result[c.messageId]).toBeDefined()
      expect(result[c.messageId]).not.toBeInstanceOf(Error)
      expect(result[c.messageId]).toHaveProperty("errorId", c.errorId)
      expect(result[c.messageId]).toHaveProperty("workflowId")
    }
  })
})
