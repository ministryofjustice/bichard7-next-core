import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

const code = TriggerCode.TRPR0031
const resultCodes = [1030, 1032, 1115, 1116, 1134, 1507, 1508, 4575, 4576, 4577]

describe("TRPR0031", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  /*   it("should generate a single case trigger for a single offence with each of triggers's result codes", () => {
    resultCodes.forEach(async (resultCode) => {
      const inputMessage = generateSpiMessage({
        offences: [
          {
            results: [{ code: resultCode }]
          }
        ]
      })

      const { triggers } = await processPhase1Message(inputMessage)

      expect(triggers).toStrictEqual([{ code }])
    })
  })

  it("should generate triggers for multiple matching result codes", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: resultCodes[0] }]
        },
        {
          results: [{ code: resultCodes[1] }]
        },
        {
          results: [{ code: resultCodes[2] }]
        },
        {
          results: [{ code: resultCodes[3] }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([
      { code, offenceSequenceNumber: 1 },
      { code, offenceSequenceNumber: 2 },
      { code, offenceSequenceNumber: 3 },
      { code, offenceSequenceNumber: 4 }
    ])
  }) */
})
