jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100209", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if the Court PNC Identifier value is invalid", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      courtPncIdentifier: "invalid",
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right exceptions are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100209",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "CourtPNCIdentifier"]
      }
    ])
  })
})
