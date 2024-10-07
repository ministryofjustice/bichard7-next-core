import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100507", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception when an offence was added in court and it is a penalty case", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { code: "TH68010", results: [{}], offenceSequenceNumber: 1 },
        { code: "TH68151", results: [{}], offenceSequenceNumber: 2 }
      ]
    })

    const pncMessage = generateSpiMessage({
      offences: [{ code: "TH68010", results: [{}], offenceSequenceNumber: 1 }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true,
      pncCaseType: "penalty",
      pncMessage
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100507",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
