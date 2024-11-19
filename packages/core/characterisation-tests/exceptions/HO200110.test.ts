import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200110", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe("when a dummy ASN", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200110 exception for %s when recordable on PNC",
      async (messageType) => {
        const inputMessage = generatePhase2Message({
          arrestSummonsNumber: "0800PP0111111111111A",
          messageType,
          offences: [{ results: [{}] }],
          recordableOnPncIndicator: true
        })

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage)

        expect(exceptions).toStrictEqual([
          {
            code: "HO200110",
            path: asnPath
          }
        ])
      }
    )

    it("doesn't create a HO200110 exception when not recordable on PNC", async () => {
      const inputMessage = generatePhase2Message({
        arrestSummonsNumber: "0800PP0111111111111A",
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        offences: [{ results: [{}] }],
        recordableOnPncIndicator: false
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage, { expectRecord: false })

      expect(exceptions).not.toContainEqual({
        code: "HO200110",
        path: asnPath
      })
    })
  })
})
