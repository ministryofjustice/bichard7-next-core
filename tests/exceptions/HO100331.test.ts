jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100331", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception when there are more than 100 offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: Array(101).fill({ results: [{}], recordable: true })
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: true
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100331",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "CourtReference", "MagistratesCourtReference"]
      }
    ])
  })
})
