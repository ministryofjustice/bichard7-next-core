import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100232", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should not throw an exception for a valid offence location", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ code: "MC80524", results: [{ code: 4584 }], location: "somewhere" }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
  })

  it("should create an exception if the offence location is less than the min length", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }], location: "" }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100232",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "LocationOfOffence"
        ]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the offence location is greater than the max length", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }], location: "x".repeat(100) }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100232",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "LocationOfOffence"
        ]
      }
    ])
  })
})
