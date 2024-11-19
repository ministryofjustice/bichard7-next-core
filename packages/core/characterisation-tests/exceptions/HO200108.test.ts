import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200108", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each([
    {
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT
    },
    {
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
    },
    {
      messageType: MessageType.PNC_UPDATE_DATASET,
      resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT
    }
  ])("creates a HO200108 exception for $messageType when $resultClass", async ({ messageType, resultClass }) => {
    const inputMessage = generatePhase2Message({
      messageType,
      offences: [
        {
          results: [{ resultClass, pncDisposalType: 2060 }],
          addedByTheCourt: false
        }
      ]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200108",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("doesn't create a HO200108 exception when not 2060 disposal type", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {
          results: [{ resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, pncDisposalType: 1015 }],
          addedByTheCourt: false
        }
      ]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage, { expectRecord: false })

    expect(exceptions).not.toContainEqual({
      code: "HO200108",
      path: offenceResultClassPath(0, 0)
    })
  })

  it("doesn't create a HO200108 exception when reportable result", async () => {
    const inputMessage = generatePhase2Message({
      messageType: MessageType.ANNOTATED_HEARING_OUTCOME,
      offences: [
        {
          results: [{ resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncDisposalType: 1505 }],
          addedByTheCourt: false
        }
      ]
    })

    const {
      outputMessage: { Exceptions: exceptions }
    } = await processPhase2Message(inputMessage)

    expect(exceptions).not.toContainEqual({
      code: "HO200108",
      path: offenceResultClassPath(0, 0)
    })
  })
})
