import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200114", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO200114 exception for PncUpdateDataset when results with judgement with final result and sentence", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.PNC_UPDATE_DATASET,
      offences: [
        {
          results: [
            { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: true },
            { resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }
          ]
        }
      ],
      pncAdjudication: {},
      pncDisposals: [{ type: 1000 }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200114",
        path: asnPath
      }
    ])
  })

  it("doesn't create a HO200114 exception for AHO when results with judgement with final result and sentence", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {
          results: [
            { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: true },
            { resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }
          ]
        }
      ],
      pncAdjudication: {},
      pncDisposals: [{ type: 1000 }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage)

    expect(exceptions).not.toContainEqual({
      code: "HO200114",
      path: asnPath
    })
  })
})
