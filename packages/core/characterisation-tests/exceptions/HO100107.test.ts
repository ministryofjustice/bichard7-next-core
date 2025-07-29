import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe("HO100107", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception if the reasonForOffenceBailConditions is too long", async () => {
    const inputMessage = generateSpiMessage({
      reasonForBailConditionsOrCustody: "X".repeat(2501),
      offences: [{ results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100107",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "Result",
        0,
        "ReasonForOffenceBailConditions"
      ]
    })
  })
})
