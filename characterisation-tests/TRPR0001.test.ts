jest.setTimeout(20000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"

describe("TRPR0001", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger correctly with single offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [3070] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers correctly with multiple offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [3070] }, { resultCodes: [1015] }, { resultCodes: [3070] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 3 }
    ])
  })

  it("should generate a trigger when record cannot be found in the PNC", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ resultCodes: [3070] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })
})
