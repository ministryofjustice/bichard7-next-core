import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe("HO200101", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO200101 exception for AHO when adjournment with judgement", () => {
    const aho = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ results: [{ resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, pncAdjudicationExists: true }] }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = processPhase2Message(aho)

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
      resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
    }
  ])("doesn't create a HO200101 exception for $messageType when $resultClass", ({ messageType, resultClass }) => {
    const inputMessage = generatePhase2Message({
      messageType,
      offences: [{ results: [{ resultClass, pncAdjudicationExists: true }] }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = processPhase2Message(inputMessage)

    expect(exceptions).not.toContainEqual({
      code: "HO200101",
      path: offenceResultClassPath(0, 0)
    })
  })
})
