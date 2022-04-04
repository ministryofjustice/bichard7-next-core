jest.setTimeout(30000)

import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

describe("HO100300", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if the Court Hearing Location is not found", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      courtHearingLocation: "B99EF01",
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      }
    ])
  })

  it.only("should create an exception if the Next Hearing Location is not found", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [
            {
              code: 2059
            }
          ]
        }
      ]
    })

    console.log(inputMessage)
    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      }
    ])
  })
})
