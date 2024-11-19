import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("TRPS0013", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a TRPS0013 for AnnotatedHearingOutcome when no operations and exceptions are generated", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "NoOperationsAndExceptions",
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ offenceReasonSequence: true, results: [{ numberOfOffencesTic: true }] }]
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0013, offenceSequenceNumber: 1 })
  })

  it.ifNewBichard(
    "creates a TRPS0013 for PncUpdateDataset when no operations and exceptions are generated",
    async () => {
      const inputMessage = generatePhase2Message({
        hoTemplate: "NoOperationsAndExceptions",
        messageType: MessageType.PNC_UPDATE_DATASET,
        offences: [{ offenceReasonSequence: true, results: [{ numberOfOffencesTic: true }] }]
      })

      const { triggers } = await processPhase2Message(inputMessage)

      expect(triggers).toContainEqual({ code: TriggerCode.TRPS0013, offenceSequenceNumber: 1 })
    }
  )

  it("creates a TRPS0013 for AnnotatedHearingOutcome when hearing outcome is aint case", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "AintCase",
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ offenceReasonSequence: true, results: [{ numberOfOffencesTic: true }] }]
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0013, offenceSequenceNumber: 1 })
  })
})
