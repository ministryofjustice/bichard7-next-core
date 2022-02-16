jest.setTimeout(30000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage, { Guilt } from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"

const code = TriggerCode.TRPR0020
const resultCode = 3501
const offenceCode = "CJ03507"

describe("TRPR0020", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a single case trigger for a single offence with the triggers's result code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: resultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate a single case trigger for a single offence with the triggers's offence code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 3502 }],
          finding: Guilt.Guilty
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate triggers for multiple matching offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: "MC80515",
          results: [{ code: resultCode }],
          finding: Guilt.Guilty
        },
        {
          code: "MC80515",
          results: [{ code: 3502 }],
          finding: Guilt.Guilty
        },
        {
          code: "MC80515",
          results: [{ code: resultCode }],
          finding: Guilt.Guilty
        },
        {
          code: offenceCode,
          results: [{ code: 3502 }],
          finding: Guilt.Guilty
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([
      { code, offenceSequenceNumber: 1 },
      { code, offenceSequenceNumber: 3 },
      { code, offenceSequenceNumber: 4 }
    ])
  })

  it("should not generate trigger for offence when not guilty", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: "MC80515",
          results: [{ code: resultCode }],
          finding: Guilt.NotGuilty
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, true, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should generate a trigger when record is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 3502 }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, true)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })
})
