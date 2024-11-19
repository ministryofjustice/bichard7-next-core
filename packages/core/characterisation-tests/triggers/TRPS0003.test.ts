import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("TRPS0003", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a TRPS0003 for AnnotatedHearingOutcome when no operations and HO200200 exception", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "NoOperationsAndExceptions",
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {
          results: [
            {
              cjsResultCode: 1100,
              numberOfOffencesTic: true,
              resultVariableText: `Exclusion order made for 6 months. The defendant is not to enter ${"A".repeat(100)}.`
            }
          ]
        }
      ],
      pncAdjudication: {},
      pncDisposals: [{ type: 1000 }],
      pncId: "2000/0000000X"
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0003, offenceSequenceNumber: 1 })
  })

  it.ifNewBichard("creates a TRPS0003 for PncUpdateDataset when no operations and HO200200 exception", async () => {
    const inputMessage = generatePhase2Message({
      hoTemplate: "NoOperationsAndExceptions",
      messageType: MessageType.PNC_UPDATE_DATASET,
      offences: [
        {
          results: [
            {
              cjsResultCode: 1100,
              numberOfOffencesTic: true,
              resultVariableText: `Exclusion order made for 6 months. The defendant is not to enter ${"A".repeat(100)}.`
            }
          ]
        }
      ],
      pncAdjudication: {},
      pncDisposals: [{ type: 1000 }],
      pncId: "2000/0000000X"
    })

    const { triggers } = await processPhase2Message(inputMessage)

    expect(triggers).toContainEqual({ code: TriggerCode.TRPS0003, offenceSequenceNumber: 1 })
  })
})
