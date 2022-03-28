jest.setTimeout(30000)

import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

describe("HO100220", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  // This should be raised but is currently masked by a parse error
  it.skip("should be raised if the bail conditions are empty", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      bailConditions: "X".repeat(2501),
      // ASN: "ABCDEFGHXXXXXX",
      offences: [{ results: [{}] }]
    })
    console.log(inputMessage)

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100220",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
