jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100245", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  // This should be raised but is currently masked by a parse error
  it.ifNewBichard("should be raised if the result text is too long", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ text: "X".repeat(2501) }] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100245",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      }
    ])
  })
})
