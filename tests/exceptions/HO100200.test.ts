jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100200", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if the Court Hearing Location value is invalid", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      courtHearingLocation: "inval!d",
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toContainEqual({
      code: "HO100200",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
    })
  })
})
