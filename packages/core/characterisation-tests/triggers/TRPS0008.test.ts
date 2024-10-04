import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("TRPS0008", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a TRPS0008 for AnnotatedHearingOutcome when no operations and exceptions are generated and result code is 3105", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      hoTemplate: "NoOperationsAndExceptions",
      offences: [{ results: [{ cjsResultCode: 3105 }] }]
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0008, offenceSequenceNumber: 1 })
  })

  it.ifNewBichard(
    "creates a TRPS0008 for PncUpdateDataset when no operations and exceptions are generated and result code is 3105",
    async () => {
      const inputMessage = generatePhase2Message({
        messageType: MessageType.PNC_UPDATE_DATASET,
        hoTemplate: "NoOperationsAndExceptions",
        offences: [{ results: [{ cjsResultCode: 3105 }] }]
      })

      const { triggers } = await processPhase2Message(inputMessage)

      expect(triggers).toContainEqual({ code: TriggerCode.TRPS0008, offenceSequenceNumber: 1 })
    }
  )

  it("creates a TRPS0008 for AnnotatedHearingOutcome when hearing outcome is AINT case are generated and result code is 3105", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      hoTemplate: "AintCase",
      offences: [{ results: [{ cjsResultCode: 3105 }] }]
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0008, offenceSequenceNumber: 1 })
  })
})
