import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100306", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should not create an exception for a valid offence code format", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ code: "MC80524", results: [{ code: 4584 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
  })

  it("should create an exception if the offence code has an invalid format", async () => {
    // Legacy Bichard raises 'Offence Code not recognised' but core raises 'Offence Code not found' exception
    const expectedExceptionCode = process.env.USE_BICHARD ? "HO100251" : "HO100306"
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }], code: "$$$" }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: expectedExceptionCode,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      }
    ])
  })
})
