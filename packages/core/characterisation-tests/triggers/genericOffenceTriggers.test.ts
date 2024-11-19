import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const offenceTests = [
  {
    code: TriggerCode.TRPR0001,
    recordable: TriggerRecordable.Both,
    resultCode: 3070
  },
  {
    code: TriggerCode.TRPR0016,
    recordable: TriggerRecordable.Yes,
    resultCode: 3055
  },
  {
    code: TriggerCode.TRPR0017,
    recordable: TriggerRecordable.Yes,
    resultCode: 2007
  },
  {
    code: TriggerCode.TRPR0021,
    recordable: TriggerRecordable.Both,
    resultCode: 3002
  },
  {
    code: TriggerCode.TRPR0026,
    recordable: TriggerRecordable.Both,
    resultCode: 3075
  }
]

describe.ifPhase1("Generic offence triggers", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe.each(offenceTests)("Testing generic trigger $code", ({ code, resultCode }) => {
    it("should generate a trigger correctly with single offences", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode }] }]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })

    it("should generate multiple triggers correctly with multiple offences", async () => {
      const inputMessage = generateSpiMessage({
        offences: [
          { results: [{ code: resultCode }] },
          { results: [{ code: 1015 }] },
          { results: [{ code: resultCode }] }
        ]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([
        { code, offenceSequenceNumber: 1 },
        { code, offenceSequenceNumber: 3 }
      ])
    })

    it("should generate a trigger when record is recordable", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode }] }]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
    })
  })
})
