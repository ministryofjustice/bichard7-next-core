import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const expectedExceptions = [
  {
    code: "HO100244",
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "NumberSpecifiedInResult",
      0
    ]
  }
]

describe.ifPhase1("HO100244", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should not be raised if the number in the result is acceptable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 3008, outcome: { penaltyPoints: 100 } }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
  })

  it.ifNewBichard("should be raised if the number in the result is too large", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 3008, outcome: { penaltyPoints: 10000 } }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual(expectedExceptions)
  })

  it.ifNewBichard("should be raised if the number in the result is too small", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 3008, outcome: { penaltyPoints: 0.1 } }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual(expectedExceptions)
  })
})
