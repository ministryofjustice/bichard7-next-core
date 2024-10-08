import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import type { GeneratePhase2MessageOptions } from "../helpers/generatePhase2Message"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200200", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  const generateOptions = (messageType: MessageType, resultVariableText: string): GeneratePhase2MessageOptions => ({
    messageType,
    offences: [
      {
        results: [
          {
            cjsResultCode: 1100,
            resultVariableText,
            durations: [
              { type: "Custodial", unit: "D", length: 30 },
              { type: "Community Punishment", unit: "H", length: 123 }
            ],
            pncAdjudicationExists: true,
            numberOfOffencesTic: true
          }
        ]
      }
    ],
    pncId: "2000/0000000X",
    pncAdjudication: {},
    pncDisposals: [{ type: 1000 }]
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "creates a HO200200 exception for %s when result text is too long",
    async (messageType) => {
      const inputMessage = generatePhase2Message(
        generateOptions(
          messageType,
          `Exclusion order made for 6 months. The defendant is not to enter ${"A".repeat(100)}.`
        )
      )

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).toContainEqual({
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      })
    }
  )

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "doesn't create a HO200200 exception for %s when result text within the limit",
    async (messageType) => {
      const inputMessage = generatePhase2Message(
        generateOptions(messageType, "Exclusion order made for 6 months. The defendant is not to enter some location.")
      )

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      })
    }
  )
})
