import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { amountSpecifiedInResultPath } from "../helpers/errorPaths"
import type { Duration, GeneratePhase2MessageOptions } from "../helpers/generatePhase2Message"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200205", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  const generateOptions = (
    messageType: MessageType,
    amountSpecifiedInResults: number[],
    durations: Duration[]
  ): GeneratePhase2MessageOptions => ({
    messageType,
    offences: [
      {
        results: [
          {
            cjsResultCode: 1100,
            amountSpecifiedInResults,
            durations,
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

  describe("when two durations in result", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200205 exception for %s when amount specified for result is too long",
      async (messageType) => {
        const inputMessage = generatePhase2Message(
          generateOptions(
            messageType,
            [10_000_000.99, 100],
            [
              { type: "Custodial", unit: "D", length: 30 },
              { type: "Community Punishment", unit: "H", length: 123 }
            ]
          )
        )

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage)

        expect(exceptions).toContainEqual({
          code: "HO200205",
          path: amountSpecifiedInResultPath(0, 0, 0)
        })
      }
    )
  })

  describe("when three durations in result", () => {
    it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
      "creates a HO200205 exception for %s when amount specified for result is too long",
      async (messageType) => {
        const inputMessage = generatePhase2Message(
          generateOptions(
            messageType,
            [100, 100, 10_000_000.99],
            [
              { type: "Custodial", unit: "D", length: 30 },
              { type: "Community Punishment", unit: "H", length: 123 },
              { type: "Rehabilitation", unit: "H", length: 42 }
            ]
          )
        )

        const {
          outputMessage: { Exceptions: exceptions }
        } = await processPhase2Message(inputMessage)

        expect(exceptions).toContainEqual({
          code: "HO200205",
          path: amountSpecifiedInResultPath(0, 0, 2)
        })
      }
    )
  })

  it.each([MessageType.ANNOTATED_HEARING_OUTCOME, MessageType.PNC_UPDATE_DATASET])(
    "doesn't create a HO200205 exception for %s when amount specified for result is within the limit",
    async (messageType) => {
      const inputMessage = generatePhase2Message(
        generateOptions(
          messageType,
          [100, 100],
          [
            { type: "Custodial", unit: "D", length: 30 },
            { type: "Community Punishment", unit: "H", length: 123 }
          ]
        )
      )

      const {
        outputMessage: { Exceptions: exceptions }
      } = await processPhase2Message(inputMessage)

      expect(exceptions).not.toContainEqual({
        code: "HO200205",
        path: amountSpecifiedInResultPath(0, 0, 0)
      })
    }
  )
})
