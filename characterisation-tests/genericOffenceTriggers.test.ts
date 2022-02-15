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
    code: TriggerCode.TRPR0016,
    resultCode: 3055,
    recordable: TriggerRecordable.Yes
  },
  {
    code: TriggerCode.TRPR0017,
    resultCode: 2007,
    recordable: TriggerRecordable.No
  },
  {
    code: TriggerCode.TRPR0021,
    resultCode: 3002,
    recordable: TriggerRecordable.Both
  },
  {
    code: TriggerCode.TRPR0026,
    resultCode: 3075,
    recordable: TriggerRecordable.Both
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
        offences: [{ results: [{ code: resultCode }] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })

    it("should generate multiple triggers correctly with multiple offences", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [
          { results: [{ code: resultCode }] },
          { results: [{ code: 1015 }] },
          { results: [{ code: resultCode }] }
        ]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([
        { code, offenceSequenceNumber: 1 },
        { code, offenceSequenceNumber: 3 }
      ])
    })
  })

  describe.each(nonRecordableOffenceTests)("Testing generic non-recordable trigger $code", ({ resultCode }) => {
    it("should not generate a trigger when record is not recordable", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: resultCode }], recordable: false }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage, false, false)

      // Check the right triggers are generated
      expect(triggers).toHaveLength(0)
    })
  })

  describe.each(recordableOffenceTests)("Testing generic recordable trigger $code", ({ code, resultCode }) => {
    it("should generate a trigger when record is recordable", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: resultCode }] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage, true)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })
  })
})
