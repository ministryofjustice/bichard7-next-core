import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe("HO200106", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe("when sentence for offence result", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200106 exception for %s when PNC adjudication doesn't exist and not added by the court",
      (messageType) => {
        const inputMessage = generatePhase2Message({
          messageType,
          offences: [
            {
              results: [{ resultClass: ResultClass.SENTENCE, pncAdjudicationExists: false }],
              addedByTheCourt: false
            }
          ]
        })

        const {
          outputMessage: { Exceptions: exceptions }
        } = processPhase2Message(inputMessage)

        expect(exceptions).toStrictEqual([
          {
            code: "HO200106",
            path: offenceResultClassPath(0, 0)
          }
        ])
      }
    )

    it("doesn't create a HO200106 exception when PNC adjudication exists", () => {
      const inputMessage = generatePhase2Message({
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        offences: [
          {
            results: [{ resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }],
            addedByTheCourt: false
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200106",
        path: offenceResultClassPath(0, 0)
      })
    })

    it("doesn't create a HO200106 exception when PNC adjudication doesn't exist but added by the court", () => {
      const inputMessage = generatePhase2Message({
        messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
        offences: [
          {
            results: [{ resultClass: ResultClass.SENTENCE, pncAdjudicationExists: false }],
            addedByTheCourt: true
          }
        ]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200106",
        path: offenceResultClassPath(0, 0)
      })
    })
  })
})
