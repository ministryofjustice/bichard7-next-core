import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("TRPS0011", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a TRPS0011 for AnnotatedHearingOutcome when no operations and exceptions are generated", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "NoOperationsAndExceptions",
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0011, offenceSequenceNumber: 1 })
  })

  it.ifNewBichard(
    "creates a TRPS0011 for PncUpdateDataset when no operations and exceptions are generated",
    async () => {
      const inputMessage = generatePhase2Message({
        hoTemplate: "NoOperationsAndExceptions",
        messageType: MessageType.PNC_UPDATE_DATASET
      })

      const { triggers } = await processPhase2Message(inputMessage)

      expect(triggers).toContainEqual({ code: TriggerCode.TRPS0011, offenceSequenceNumber: 1 })
    }
  )

  it("creates a TRPS0011 for AnnotatedHearingOutcome when hearing outcome is AINT case", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "AintCase",
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {},
        {
          addedByTheCourt: true,
          offenceReasonSequence: true,
          results: [{}]
        }
      ]
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0011, offenceSequenceNumber: 2 })
  })
})
