import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200100", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe("when adjournment pre-judgement for offence result", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200100 exception for %s when PNC adjudication exists",
      async (messageType) => {
        const inputMessage = generatePhase2Message({
          messageType,
          offences: [
            {
              results: [{ resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, pncAdjudicationExists: true }]
            }
          ]
        })

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage)

        expect(exceptions).toStrictEqual([
          {
            code: "HO200100",
            path: offenceResultClassPath(0, 0)
          }
        ])
      }
    )

    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "doesn't create a HO200100 exception for %s when PNC adjudication doesn't exist",
      async (messageType) => {
        const inputMessage = generatePhase2Message({
          messageType,
          offences: [
            {
              results: [{ resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, pncAdjudicationExists: false }]
            }
          ]
        })

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage, { expectRecord: false })

        expect(exceptions).toHaveLength(0)
      }
    )
  })
})
