import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100217", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard("should create an exception if the address line 1 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine1: "X".repeat(36) } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine1"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 1 is too short", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine1: "" } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine1"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 2 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine2: "X".repeat(36) } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine2"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 2 is too short", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine2: "" } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine2"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 3 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine3: "X".repeat(36) } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine3"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 3 is too short", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine3: "" } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine3"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 4 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine4: "X".repeat(36) } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine4"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 4 is too short", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine4: "" } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine4"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 5 is too many characters", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine5: "X".repeat(36) } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine5"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the address line 5 is too short", async () => {
    const inputMessage = generateSpiMessage({
      person: { address: { addressLine5: "" } },
      offences: [{ results: [] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100217",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Address", "AddressLine5"]
      }
    ])
  })
})
