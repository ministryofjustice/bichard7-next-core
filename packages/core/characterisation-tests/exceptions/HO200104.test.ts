import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200104", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO200104 exception for AHO when result class is sentence", async () => {
    const aho = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ results: [{ resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }] }],
      pncAdjudication: {},
      pncDisposals: [{ type: 2007 }, { type: 1000 }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(aho)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200104",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("creates a HO200104 exception for AHO when result class is judgement with final result", async () => {
    const aho = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [{ results: [{ resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: true }] }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(aho)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200104",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("doesn't create an exception for a PncUpdateDataset when result class is judgement with final result", async () => {
    const pncUpdateDataset = generatePhase2Message({
      messageType: MessageType.PNC_UPDATE_DATASET,
      offences: [{ results: [{ resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: true }] }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(pncUpdateDataset, { expectRecord: false })

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't create an exception for a PncUpdateDataset when result class is sentence", async () => {
    const pncUpdateDataset = generatePhase2Message({
      messageType: MessageType.PNC_UPDATE_DATASET,
      offences: [{ results: [{ resultClass: ResultClass.SENTENCE, pncAdjudicationExists: true }] }],
      pncDisposals: [{ type: 2007 }, { type: 1000 }]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(pncUpdateDataset, { expectRecord: false })

    expect(exceptions).toHaveLength(0)
  })
})
