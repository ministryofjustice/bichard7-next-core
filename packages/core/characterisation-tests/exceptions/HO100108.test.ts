import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import type { GenerateSpiMessageOptions } from "../helpers/generateSpiMessage"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100108", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception if the remand status is invalid", async () => {
    const inputMessage = generateSpiMessage({
      bailStatus: "X",
      offences: [{ results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100108",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "RemandStatus"]
      }
    ])
  })

  it("should create an exception if the offence remand status is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ bailStatus: "X" }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100108",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "OffenceRemandStatus"
        ]
      }
    ])
  })

  it("should create an exception if the offence verdict is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ finding: "X", results: [{}] }]
    } as any as GenerateSpiMessageOptions)

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100108",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "Verdict"
        ]
      }
    ])
  })

  it("should create an exception if the offence mode of trial is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ modeOfTrial: "0", results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100108",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ModeOfTrialReason"
        ]
      }
    ])
  })
})
