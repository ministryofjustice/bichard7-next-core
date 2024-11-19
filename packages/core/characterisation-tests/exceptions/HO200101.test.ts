import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200101", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO200101 exception for AHO when adjournment with judgement", async () => {
    const aho = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ results: [{ pncAdjudicationExists: true, resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT }] }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(aho)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200101",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it.each([
    {
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      processMessageOptions: { expectRecord: false },
      resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      processMessageOptions: { expectRecord: false },
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
    }
  ])(
    "doesn't create a HO200101 exception for $messageType when $resultClass",
    async ({ messageType, processMessageOptions, resultClass }) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [{ results: [{ pncAdjudicationExists: true, resultClass }] }]
      })

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage, processMessageOptions)

      expect(exceptions).not.toContainEqual({
        code: "HO200101",
        path: offenceResultClassPath(0, 0)
      })
    }
  )
})
