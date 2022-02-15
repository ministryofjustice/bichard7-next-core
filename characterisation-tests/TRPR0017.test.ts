jest.setTimeout(20000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"

describe("TRPR0017", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger correctly with single offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [2007] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0017, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers correctly with multiple offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [2007] }, { resultCodes: [1015] }, { resultCodes: [2007] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([
      { code: TriggerCode.TRPR0017, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0017, offenceSequenceNumber: 3 }
    ])
  })

  it("should not generate a trigger when record is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [2007], recordable: false }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })
})
