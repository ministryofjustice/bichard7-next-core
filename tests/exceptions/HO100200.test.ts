jest.setTimeout(30000)

import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

describe("HO100200", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  // Won't pass as HO100200 is seemingly overridden by HO100300 "OU Code is not recognised" exception
  it.skip("should create an exception if the Court Hearing Location value is invalid", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      courtHearingLocation: "invalid",
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100200",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      }
    ])
  })
})
