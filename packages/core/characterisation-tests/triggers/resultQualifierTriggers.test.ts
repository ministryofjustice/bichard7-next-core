import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

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
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe.each(offenceTests)("Testing result qualifier trigger $code", ({ code, resultCode, resultQualifier }) => {
    it("should generate a trigger correctly with single offences", async () => {
      const inputMessage = generateSpiMessage({
        offences: [
          {
            results: [{ code: resultCode, qualifier: resultQualifier }]
          }
        ]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate multiple triggers correctly with multiple offences", async () => {
      const inputMessage = generateSpiMessage({
        offences: [
          {
            results: [{ code: resultCode, qualifier: resultQualifier }]
          },
          { results: [{ code: 1015 }] },
          { results: [{ code: resultCode, qualifier: resultQualifier }] }
        ]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate a trigger when record is not recordable", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode, qualifier: resultQualifier }], recordable: false }]
      })

      const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate a trigger when record is recordable", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode, qualifier: resultQualifier }] }]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
    })
  })
})
