import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0003
const mainResultCode = 1100
const yroResultCode = 1141
const yroSpecificRequirementResultCode = 3104

describe.ifPhase1("TRPR0003", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger for a single offence with a main result code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: mainResultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate a trigger for a single offence with a combination of YRO result codes", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should not generate a trigger for a single offence with only one YRO result code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: yroResultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger for a single offence with only one YRO Specific Requirement result code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should generate a trigger for a single offence with main result code and a combination of YRO result codes", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: mainResultCode }, { code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers for multiple matching offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: mainResultCode }, { code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        },
        {
          results: [{ code: yroResultCode }, { code: yroSpecificRequirementResultCode }]
        },
        {
          results: [{ code: 1015 }]
        },
        { results: [{ code: mainResultCode }] }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([
      { code, offenceSequenceNumber: 1 },
      { code, offenceSequenceNumber: 2 },
      { code, offenceSequenceNumber: 4 }
    ])
  })

  it("should generate a trigger when record is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: mainResultCode }], recordable: false }]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })
})
