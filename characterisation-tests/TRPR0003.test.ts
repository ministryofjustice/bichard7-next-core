jest.setTimeout(30000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"

const code = TriggerCode.TRPR0003
const mainResultCode = 1100
const yroResultCode = 1141
const yroSpecificRequirementResultCode = 3104

describe("TRPR0003", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger for a single offence with a main result code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: mainResultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate a trigger for a single offence with a combination of YRO result codes", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should not generate a trigger for a single offence with only one YRO result code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: yroResultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, true, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger for a single offence with only one YRO Specific Requirement result code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, true, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should generate a trigger for a single offence with main result code and a combination of YRO result codes", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: mainResultCode }, { code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers for multiple matching offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: mainResultCode }, { code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        },
        {
          results: [{ code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        },
        {
          results: [{ code: 1015 }]
        },
        { results: [{ code: mainResultCode }] }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([
      { code, offenceSequenceNumber: 1 },
      { code, offenceSequenceNumber: 2 },
      { code, offenceSequenceNumber: 4 }
    ])
  })

  it("should generate a trigger when record is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: mainResultCode }], recordable: false }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, true)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })
})
