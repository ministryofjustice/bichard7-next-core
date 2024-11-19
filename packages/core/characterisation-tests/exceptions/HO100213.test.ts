import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100213", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should create an exception if the Person's given name 1 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { givenName1: "X".repeat(36) },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100213",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "DefendantDetail",
          "PersonName",
          "GivenName",
          0
        ]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the Person's given name 2 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { givenName1: "one", givenName2: "X".repeat(36) },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100213",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "DefendantDetail",
          "PersonName",
          "GivenName",
          1
        ]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the Person's given name 3 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { givenName1: "one", givenName2: "Two", givenName3: "X".repeat(36) },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100213",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "DefendantDetail",
          "PersonName",
          "GivenName",
          2
        ]
      }
    ])
  })
})
