jest.setTimeout(30000)

import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

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
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100209",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "CourtPNCIdentifier"]
      }
    ])
  })
})
