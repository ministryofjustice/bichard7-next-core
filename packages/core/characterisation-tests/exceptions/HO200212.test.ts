import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe("HO200212", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200212 exception for %s when offence results are not recordable",
    (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [{ results: [{ pncDisposalType: 1000 }] }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = processPhase2Message(inputMessage)

      expect(exceptions).toStrictEqual([
        {
          code: "HO200212",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "CriminalProsecutionReference",
            "OffenceReason",
            "OffenceCode",
            "Reason"
          ]
        }
      ])
    }
  )

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "doesn't create a HO200212 exception for %s when offence results are recordable",
    (messageType) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [{ results: [{ pncDisposalType: 1015 }] }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = processPhase2Message(inputMessage)

      expect(exceptions).toHaveLength(0)
    }
  )
})
