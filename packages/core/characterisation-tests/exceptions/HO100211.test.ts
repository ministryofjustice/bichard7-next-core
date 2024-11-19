import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100211", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  // TODO: We haven't implemented organisations yet
  it.skip("should create an exception if the Organisation Name is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      organisation: { name: "X".repeat(256) },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100211",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "DefendantDetail",
          "PersonName",
          "Title"
        ]
      }
    ])
  })

  it.skip("should create an exception if the Organisation Name is too few characters", async () => {
    const inputMessage = generateSpiMessage({
      organisation: { name: "" },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100211",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "DefendantDetail",
          "PersonName",
          "Title"
        ]
      }
    ])
  })
})
