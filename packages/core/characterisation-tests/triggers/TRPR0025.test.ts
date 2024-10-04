import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0025
const offenceCode = "MC80524"
const resultCode = 4584

describe.ifPhase1("TRPR0025", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a single case trigger for a single offence with matching offence and result codes", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger with only the matching offence code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1005 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger with only the matching result code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: 1005 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toHaveLength(0)
  })

  it("should generate a single trigger for multiple matching offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        },
        {
          code: offenceCode,
          results: [{ code: resultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: resultCode }],
          recordable: false
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })
})
