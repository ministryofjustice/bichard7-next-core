import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100247", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should be raised if the result qualifier code is too short", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ qualifier: "" }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100247",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "Result",
        0,
        "ResultQualifierVariable",
        0,
        "Code"
      ]
    })
  })

  it.ifNewBichard("should be raised if the result qualifier code is too long", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ qualifier: "XXX" }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100247",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "Result",
        0,
        "ResultQualifierVariable",
        0,
        "Code"
      ]
    })
  })
})
