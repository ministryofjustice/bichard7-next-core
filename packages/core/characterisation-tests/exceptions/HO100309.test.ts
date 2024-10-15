import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100309", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception if the result code qualifier is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ qualifier: "XX" }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100309",
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
      }
    ])
  })
})
