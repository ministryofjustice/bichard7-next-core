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
          messageType,
          recordableOnPncIndicator: true,
          arrestSummonsNumber: "0800PP0111111111111A",
          offences: [{ results: [{}] }]
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
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        recordableOnPncIndicator: false,
        arrestSummonsNumber: "0800PP0111111111111A",
        offences: [{ results: [{}] }]
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
