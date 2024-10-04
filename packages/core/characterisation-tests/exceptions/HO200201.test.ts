import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { resultQualifierVariableDurationTypePath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200201", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200201 exception for %s when qualifier variable for result contains duration",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [
          {
            results: [
              {
                resultQualifierVariables: [{ code: 1, duration: { type: "Custodial", unit: "D", length: 30 } }],
                pncAdjudicationExists: true,
                numberOfOffencesTic: true
              }
            ]
          }
        ],
        pncId: "2000/0000000X",
        pncAdjudication: {},
        pncDisposals: [{ type: 1000 }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toContainEqual({
        code: "HO200201",
        path: resultQualifierVariableDurationTypePath(0, 0, 0)
      })
    }
  )

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "doesn't create a HO200201 exception for %s when qualifier variable for result doesn't contain a duration",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [
          {
            results: [
              {
                resultQualifierVariables: [{ code: 1 }],
                pncAdjudicationExists: true
              }
            ]
          }
        ],
        pncId: "2000/0000000X",
        pncAdjudication: {},
        pncDisposals: [{ type: 1000 }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200201",
        path: resultQualifierVariableDurationTypePath(0, 0, 0)
      })
    }
  )
})
