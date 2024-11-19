import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200121", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200121 exception for %s when no offence reason sequence and recordable offences exists",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [
          {
            offenceReasonSequence: false,
            offenceCategory: { code: "B7", description: "Bichard 7-specific category" },
            results: [{}]
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200121",
          path: asnPath
        }
      ])
    }
  )

  it("doesn't create a HO200121 exception when offence reason sequence exists and non-recordable offence", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {
          offenceReasonSequence: true,
          offenceCategory: { code: "B7", description: "Bichard 7-specific category" },
          results: [{}]
        }
      ]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage, { expectRecord: false })

    expect(exceptions).not.toContainEqual({
      code: "HO200121",
      path: asnPath
    })
  })
})
