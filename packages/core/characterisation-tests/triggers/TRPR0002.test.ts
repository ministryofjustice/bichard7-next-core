import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0002
const resultCode = 4575
const resultQualifier = "EO"

describe.ifPhase1("TRPR0002", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger for a single offence without the EO result qualifier", async () => {
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

  it("should not generate a trigger for a single offence with the EO result qualifier", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: resultCode, qualifier: resultQualifier }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should generate a single case trigger for multiple offences without the EO result qualifier", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }] }, { results: [{ code: resultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger for multiple offences with the EO result qualifier", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { results: [{ code: resultCode, qualifier: resultQualifier }] },
        { results: [{ code: resultCode, qualifier: resultQualifier }] }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should generate a trigger for multiple offences with one EO result qualifier and one without", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: resultCode, qualifier: resultQualifier }]
        },
        { results: [{ code: resultCode }] }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }], recordable: false }]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })
})
