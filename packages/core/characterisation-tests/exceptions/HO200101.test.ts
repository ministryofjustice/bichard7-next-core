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
      offences: [{ results: [{ resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, pncAdjudicationExists: true }] }]
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
      resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
      processMessageOptions: { expectRecord: false }
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
      processMessageOptions: { expectRecord: false }
    }
  ])(
    "doesn't create a HO200101 exception for $messageType when $resultClass",
    async ({ messageType, resultClass, processMessageOptions }) => {
      const inputMessage = generatePhase2Message({
        messageType,
        offences: [{ results: [{ resultClass, pncAdjudicationExists: true }] }]
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
