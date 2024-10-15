import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { resultQualifierVariableCodePath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200202", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200202 exception for %s when too many qualifier variables for results",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [
          {
            results: [
              {
                resultQualifierVariables: [{ code: 1 }, { code: 2 }, { code: 3 }, { code: 4 }, { code: 5 }],
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

      expect(exceptions).toStrictEqual(
        expect.arrayContaining(
          Array.from({ length: 5 }, (_, index) => ({
            code: "HO200202",
            path: resultQualifierVariableCodePath(0, 0, index)
          }))
        )
      )
    }
  )

  it.skip.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "doesn't create a HO200202 exception for %s when within limit for qualifier variables for results",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [{ results: [{ resultQualifierVariables: [{ code: 1 }], pncAdjudicationExists: true }] }],
        pncId: "2000/0000000X",
        pncAdjudication: {},
        pncDisposals: [{ type: 1000 }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200202",
        path: resultQualifierVariableCodePath(0, 0, 0)
      })
    }
  )
})
