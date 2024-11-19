import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100103", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should create an exception if the hearing time is invalid", async () => {
    const inputMessage = generateSpiMessage({
      timeOfHearing: "XXXX",
      offences: [{ results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "TimeOfHearing"]
    })
  })

  it.ifNewBichard("should create an exception if the offence time is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ startTime: "XXXX", results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceTime"]
    })
  })

  it.ifNewBichard("should create an exception if the offence start time is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ startTime: "XXXX", offenceDateCode: 4, results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "StartTime"]
    })
  })

  it.ifNewBichard("should create an exception if the offence end time is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ endDate: new Date(), endTime: "XXXX", results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceEndTime"]
    })
  })

  it.ifNewBichard("should create an exception if the next hearing time is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ nextHearing: { nextHearingDetails: { timeOfHearing: "XXXX" } } }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "Result",
        0,
        "NextHearingTime"
      ]
    })
  })

  //TODO: Needs implementing once we've implemented in core
  it.skip("should create an exception if the time specified in the result is invalid", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ endDate: new Date(), endTime: "XXXX", results: [{}] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toContainEqual({
      code: "HO100103",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        0,
        "Result",
        0,
        "TimeSpecifiedInResult"
      ]
    })
  })
})
