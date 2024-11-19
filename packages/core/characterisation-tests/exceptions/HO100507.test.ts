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
        { code: "TH68010", offenceSequenceNumber: 1, results: [{}] },
        { code: "TH68151", offenceSequenceNumber: 2, results: [{}] }
      ]
    })

    const pncMessage = generateSpiMessage({
      offences: [{ code: "TH68010", offenceSequenceNumber: 1, results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      pncCaseType: "penalty",
      pncMessage,
      recordable: true
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100507",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
