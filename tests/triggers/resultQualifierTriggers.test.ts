jest.setTimeout(30000)

import { TriggerCode } from "src/types/TriggerCode"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

const offenceTests = [
  {
    code: TriggerCode.TRPR0023,
    resultCode: 4594,
    resultQualifier: "LG",
    recordable: TriggerRecordable.Both
  },
  {
    code: TriggerCode.TRPR0024,
    resultCode: 4594,
    resultQualifier: "LH",
    recordable: TriggerRecordable.Both
  }
]

describe("Generic offence triggers", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  describe.each(offenceTests)("Testing result qualifier trigger $code", ({ code, resultCode, resultQualifier }) => {
    it("should generate a trigger correctly with single offences", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [
          {
            results: [{ code: resultCode, qualifier: resultQualifier }]
          }
        ]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate multiple triggers correctly with multiple offences", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [
          {
            results: [{ code: resultCode, qualifier: resultQualifier }]
          },
          { results: [{ code: 1015 }] },
          { results: [{ code: resultCode, qualifier: resultQualifier }] }
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
        offences: [{ results: [{ code: resultCode, qualifier: resultQualifier }], recordable: false }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage, { recordable: false })

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate a trigger when record is recordable", async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: resultCode, qualifier: resultQualifier }] }]
      })

      // Process the mock message
      const { triggers } = await processMessage(inputMessage)

      // Check the right triggers are generated
      expect(triggers).toStrictEqual([{ code }])
    })
  })
})
