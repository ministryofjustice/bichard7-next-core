jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100108", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if the remand status is invalid", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      bailStatus: "X",
      offences: [{ results: [{}] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100108",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "RemandStatus"]
      }
    ])
  })
})
