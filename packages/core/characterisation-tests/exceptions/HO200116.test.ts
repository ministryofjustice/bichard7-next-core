import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200116", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200116 exception for %s when there are more than 100 offences",
    async (messageType) => {
      const offences = Array.from({ length: 110 }, () => ({
        results: [{ cjsResultCode: 1015 }]
      }))

      const inputMessage = generatePhase2Message({
        messageType: messageType,
        offences: offences
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200116",
          path: asnPath
        }
      ])
    }
  )
})
