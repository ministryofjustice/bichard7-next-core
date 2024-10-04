import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const expectedExceptions = [
  {
    code: "HO100240",
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "CJSresultCode"
    ]
  },
  {
    code: "HO100246",
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "PNCDisposalType"
    ]
  }
]

describe.ifPhase1("HO100240 and HO100246", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create exceptions if the result code is too low", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 123 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual(expectedExceptions)
  })

  // Masked by XML parsing error
  it.ifNewBichard("should create exceptions if the result code is too high", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 10000 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual(expectedExceptions)
  })
})
