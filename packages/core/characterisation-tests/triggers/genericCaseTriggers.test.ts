import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const offenceTests = [
  {
    code: TriggerCode.TRPR0005,
    recordable: TriggerRecordable.Both,
    resultCode: 4012
  },
  {
    code: TriggerCode.TRPR0006,
    recordable: TriggerRecordable.Both,
    resultCode: 1002
  },
  {
    code: TriggerCode.TRPR0007,
    recordable: TriggerRecordable.Both,
    resultCode: 2065
  },
  {
    code: TriggerCode.TRPR0012,
    recordable: TriggerRecordable.Both,
    resultCode: 2509
  },
  {
    code: TriggerCode.TRPR0019,
    recordable: TriggerRecordable.Both,
    resultCode: 4017
  },
  {
    code: TriggerCode.TRPR0022,
    recordable: TriggerRecordable.Both,
    resultCode: 4022
  }
]

describe.ifPhase1("Generic case triggers", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe.each(offenceTests)("Testing generic trigger $code", ({ code, resultCode }) => {
    it("should generate a trigger correctly with single offences", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode }] }]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
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

      expect(triggers).toStrictEqual([{ code }])
    })

    it("should generate a trigger when record is recordable", async () => {
      const inputMessage = generateSpiMessage({
        offences: [{ results: [{ code: resultCode }] }]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
    })
  })
})
