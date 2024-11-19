import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200103", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200103 exception for %s when PNC Adjudication does not exist and offence is not added by the court",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType: messageType,
        offences: [
          {
            recordableOnPncIndicator: true,
            results: [{ resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, pncAdjudicationExists: false }],
            addedByTheCourt: false
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200103",
          path: offenceResultClassPath(0, 0)
        }
      ])
    }
  )
})
