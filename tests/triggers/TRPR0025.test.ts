jest.setTimeout(30000)

import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

const code = TriggerCode.TRPR0025
const offenceCode = "MC80524"
const resultCode = 4584

describe("TRPR0025", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a single case trigger for a single offence with matching offence and result codes", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger with only the matching offence code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1005 }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { expectTriggers: false, expectRecord: false })

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger with only the matching result code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: 1005 }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { expectTriggers: false })

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should generate a single trigger for multiple matching offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        },
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }],
          recordable: false
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })
})
