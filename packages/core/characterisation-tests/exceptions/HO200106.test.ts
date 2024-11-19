import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200106", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe("when sentence for offence result", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200106 exception for %s when PNC adjudication doesn't exist and not added by the court",
      async (messageType) => {
        const inputMessage = generatePhase2Message({
          messageType,
          offences: [
            {
              addedByTheCourt: false,
              results: [{ pncAdjudicationExists: false, resultClass: ResultClass.SENTENCE }]
            }
          ]
        })

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage)

        expect(exceptions).toStrictEqual([
          {
            code: "HO200106",
            path: offenceResultClassPath(0, 0)
          }
        ])
      }
    )

    it("doesn't create a HO200106 exception when PNC adjudication exists", async () => {
      const inputMessage = generatePhase2Message({
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        offences: [
          {
            addedByTheCourt: false,
            results: [{ pncAdjudicationExists: true, resultClass: ResultClass.SENTENCE }]
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage, { expectRecord: false })

      expect(exceptions).not.toContainEqual({
        code: "HO200106",
        path: offenceResultClassPath(0, 0)
      })
    })

    it("doesn't create a HO200106 exception when PNC adjudication doesn't exist but added by the court", async () => {
      const inputMessage = generatePhase2Message({
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        offences: [
          {
            addedByTheCourt: true,
            results: [{ pncAdjudicationExists: false, resultClass: ResultClass.SENTENCE }]
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200106",
        path: offenceResultClassPath(0, 0)
      })
    })
  })
})
