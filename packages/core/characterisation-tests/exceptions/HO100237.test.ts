import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100237", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should create an exception if alcohol level is too high", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ alcoholLevel: { amount: 1000 }, results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100237",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "AlcoholLevel",
        "Amount"
      ]
    })
  })
})
