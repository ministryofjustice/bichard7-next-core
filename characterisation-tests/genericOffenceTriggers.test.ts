jest.setTimeout(20000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"
import TriggerRecordable from "../src/types/TriggerRecordable"

const offenceTests = [
  {
    code: TriggerCode.TRPR0001,
    resultCode: 3070,
    recordable: TriggerRecordable.Both
  },
  {
    code: TriggerCode.TRPR0017,
    resultCode: 2007,
    recordable: TriggerRecordable.No
  }
]

const recordableOffenceTests = offenceTests.filter((x) => x.recordable !== "NO")
const nonRecordableOffenceTests = offenceTests.filter((x) => x.recordable === "NO")

describe("Generic offence triggers", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  describe.each(offenceTests)("Testing generic trigger $code", ({ code, resultCode }) => {
    it("should generate a trigger correctly with single offences", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ resultCodes: [resultCode] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })

    it("should generate multiple triggers correctly with multiple offences", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ resultCodes: [resultCode] }, { resultCodes: [1015] }, { resultCodes: [resultCode] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([
        { code, offenceSequenceNumber: 1 },
        { code, offenceSequenceNumber: 3 }
      ])
    })

    describe.each(nonRecordableOffenceTests)("Testing generic non-recordable trigger $code", ({ resultCode }) => {
      it("should not generate a trigger when record is not recordable", async () => {
        // Generate a mock message
        const inputMessage = generateMessage({
          offences: [{ resultCodes: [resultCode], recordable: false }]
        })

        // Process the mock message
        const { triggers } = await processMessage(inputMessage, false)

        // Check the right triggers are generated
        expect(triggers).toHaveLength(0)
      })
    })
  })

  describe.each(recordableOffenceTests)("Testing generic recordable trigger $code", ({ code, resultCode }) => {
    it("should generate a trigger when record is recordable", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ resultCodes: [resultCode] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage, true)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })
  })
})
