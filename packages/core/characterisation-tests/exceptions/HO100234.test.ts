import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("validate hearing outcome", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should not throw an exception for a valid offence wording", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ code: "MC80524", results: [{ code: 4584 }], offenceWording: "something" }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
  })

  it("should throw an exception for an offence wording less than min length", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }], offenceWording: "" }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100234",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "ActualOffenceWording"
        ]
      }
    ])
  })

  it.ifNewBichard("should throw an exception for an offence wording greater than max length", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }], offenceWording: "x".repeat(3000) }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100234",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "ActualOffenceWording"
        ]
      }
    ])
  })
})
