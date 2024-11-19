import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import ResultClass from "../../types/ResultClass"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("TRPS0010", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.ifNewBichard(
    "creates a TRPS0010 for PncUpdateDataset when no operations and exceptions are generated",
    async () => {
      const inputMessage = generatePhase2Message({
        hasCompletedDisarrOperation: true,
        messageType: MessageType.PNC_UPDATE_DATASET,
        offences: [
          {
            addedByTheCourt: true,
            offenceReasonSequence: true,
            results: [
              {
                pncAdjudicationExists: false,
                pncDisposalType: 2007,
                resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
              }
            ]
          }
        ],
        penaltyNoticeCaseReferenceNumber: undefined
      })

      const { triggers } = await processPhase2Message(inputMessage)

      expect(triggers).toContainEqual({ code: TriggerCode.TRPS0010, offenceSequenceNumber: 1 })
    }
  )
})
