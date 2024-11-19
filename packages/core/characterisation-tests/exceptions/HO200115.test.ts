import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ResultClass from "../../types/ResultClass"
import { asnPath } from "../helpers/errorPaths"
import generatePhase2Message from "../helpers/generatePhase2Message"
import { processPhase2Message } from "../helpers/processMessage"
import MessageType from "../types/MessageType"

describe.ifPhase2("HO200115", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  describe("when the input message generates a DISARR and SUBVAR operation", () => {
    const resultsGeneratingSubvar = [
      ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
      ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
      ResultClass.SENTENCE
    ]

    describe("with results including judgement with final result and not added by the court generates DISARR", () => {
      resultsGeneratingSubvar.forEach((resultGeneratingSubvar) => {
        describe(`and ${resultGeneratingSubvar.toLowerCase()} generates SUBVAR`, () => {
          it.each([
            { messageType: MessageType.ANNOTATED_HEARING_OUTCOME },
            { messageType: MessageType.PNC_UPDATE_DATASET }
          ])("creates a HO200115 exception for $messageType", async ({ messageType }) => {
            const resultGeneratesDisarr = {
              resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
              pncAdjudicationExists: false
            }
            const inputMessage = generatePhase2Message({
              messageType,
              penaltyNoticeCaseReference: false,
              offences: [
                {
                  addedByTheCourt: false,
                  results: [resultGeneratesDisarr, { resultClass: resultGeneratingSubvar, pncAdjudicationExists: true }]
                }
              ],
              pncAdjudication: true,
              pncDisposals: [{ type: 2007 }]
            })

            const {
              outputMessage: { Exceptions: exceptions }
            } = await processPhase2Message(inputMessage)

            expect(exceptions).toStrictEqual([
              {
                code: "HO200115",
                path: asnPath
              }
            ])
          })
        })
      })
    })

    describe("with results including judgement with final result and added by the court generates DISARR", () => {
      resultsGeneratingSubvar.forEach((resultGeneratingSubvar) => {
        describe(`and ${resultGeneratingSubvar.toLowerCase()} generates SUBVAR`, () => {
          it.each([
            { messageType: MessageType.ANNOTATED_HEARING_OUTCOME },
            { messageType: MessageType.PNC_UPDATE_DATASET }
          ])("creates a HO200115 exception for $messageType", async ({ messageType }) => {
            const resultsGeneratingDisarr = [
              { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, pncAdjudicationExists: false },
              { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, pncAdjudicationExists: false }
            ]
            const inputMessage = generatePhase2Message({
              messageType,
              penaltyNoticeCaseReference: false,
              offences: [
                {
                  courtCaseReferenceNumber: true,
                  addedByTheCourt: true,
                  results: [
                    ...resultsGeneratingDisarr,
                    { resultClass: resultGeneratingSubvar, pncAdjudicationExists: true }
                  ]
                }
              ],
              pncAdjudication: true,
              pncDisposals: [{ type: 2007 }]
            })

            const {
              outputMessage: { Exceptions: exceptions }
            } = await processPhase2Message(inputMessage)

            expect(exceptions).toStrictEqual([
              {
                code: "HO200115",
                path: asnPath
              }
            ])
          })
        })
      })
    })

    describe("with results including adjournment with judgement and not added by the court generates DISARR", () => {
      resultsGeneratingSubvar.forEach((resultGeneratingSubvar) => {
        describe(`and ${resultGeneratingSubvar.toLowerCase()} generates SUBVAR`, () => {
          it.each([
            { messageType: MessageType.ANNOTATED_HEARING_OUTCOME },
            { messageType: MessageType.PNC_UPDATE_DATASET }
          ])("creates a HO200115 exception for $messageType", async ({ messageType }) => {
            const resultGeneratesDisarr = {
              resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
              pncAdjudicationExists: false
            }
            const inputMessage = generatePhase2Message({
              messageType,
              penaltyNoticeCaseReference: false,
              offences: [
                {
                  addedByTheCourt: false,
                  results: [resultGeneratesDisarr, { resultClass: resultGeneratingSubvar, pncAdjudicationExists: true }]
                }
              ],
              pncAdjudication: true,
              pncDisposals: [{ type: 2007 }]
            })

            const {
              outputMessage: { Exceptions: exceptions }
            } = await processPhase2Message(inputMessage)

            expect(exceptions).toStrictEqual([
              {
                code: "HO200115",
                path: asnPath
              }
            ])
          })
        })
      })
    })

    describe("with results including adjournment with judgement and added by the court generates DISARR", () => {
      resultsGeneratingSubvar.forEach((resultGeneratingSubvar) => {
        describe(`and ${resultGeneratingSubvar.toLowerCase()} generates SUBVAR`, () => {
          it.each([
            { messageType: MessageType.ANNOTATED_HEARING_OUTCOME },
            { messageType: MessageType.PNC_UPDATE_DATASET }
          ])("creates a HO200115 exception for $messageType", async ({ messageType }) => {
            const resultsGeneratingDisarr = [
              { resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, pncAdjudicationExists: false },
              { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, pncAdjudicationExists: false }
            ]
            const inputMessage = generatePhase2Message({
              messageType,
              penaltyNoticeCaseReference: false,
              offences: [
                {
                  courtCaseReferenceNumber: true,
                  addedByTheCourt: true,
                  results: [
                    ...resultsGeneratingDisarr,
                    { resultClass: resultGeneratingSubvar, pncAdjudicationExists: true }
                  ]
                }
              ],
              pncAdjudication: true,
              pncDisposals: [{ type: 2007 }]
            })

            const {
              outputMessage: { Exceptions: exceptions }
            } = await processPhase2Message(inputMessage)

            expect(exceptions).toStrictEqual([
              {
                code: "HO200115",
                path: asnPath
              }
            ])
          })
        })
      })
    })
  })
})
