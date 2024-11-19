import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200112", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200112 exception for %s when results with judgement with final result and sentence",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [
          {
            results: [
              { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: false },
              { resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }
            ]
          }
        ],
        pncAdjudication: {},
        pncDisposals: [{ type: 1000 }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200112",
          path: asnPath
        }
      ])
    }
  )
})
