import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100220", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should create an exception if the reasonForOffenceBailConditions is too long", async () => {
    const inputMessage = generateSpiMessage({
      reasonForBailConditionsOrCustody: "X".repeat(2501),
      offences: [{ results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100220",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ReasonForBailConditions"]
    })
  })

  it.ifNewBichard("should create an exception if the reasonForOffenceBailConditions is too long", async () => {
    const inputMessage = generateSpiMessage({
      reasonForBailConditionsOrCustody: "",
      offences: [{ results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100220",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ReasonForBailConditions"]
    })
  })
})
