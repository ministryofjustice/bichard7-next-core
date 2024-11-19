import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200113", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200113 exception for %s when NEWREM exists, there are no remand CCRs, and SENDEF exists",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType: messageType,
        offences: [
          {
            recordableOnPncIndicator: true,
            results: [{}, { resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }],
            addedByTheCourt: true
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200113",
          path: asnPath
        }
      ])
    }
  )

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200113 exception for %s when SENDEF exists and there is a remand CCR",
    async (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType: messageType,
        offences: [
          {
            recordableOnPncIndicator: true,
            results: [
              { resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true },
              { resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, pncAdjudicationExists: true }
            ],
            addedByTheCourt: true,
            courtCaseReferenceNumber: true
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200113",
          path: asnPath
        }
      ])
    }
  )
})
