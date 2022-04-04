jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100307", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if the result code is invalid", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1001 }] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100307",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "CJSresultCode"
        ]
      }
    ])
  })
})
