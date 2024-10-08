import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0030
const offenceCode = "PL84504"

describe.ifPhase1("TRPR0030", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger correctly with single non-recordable offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ code: offenceCode, results: [{ code: 1015 }], recordable: false }]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a single case level trigger with multiple non-recordable offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { code: offenceCode, results: [{ code: 1015 }], recordable: false },
        { code: offenceCode, results: [{ code: 1015 }], recordable: false },
        { code: offenceCode, results: [{ code: 1015 }], recordable: false }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger when record is recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ code: offenceCode, results: [{ code: 1015 }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage, {
      expectRecord: false
    })

    expect(triggers).toHaveLength(0)
  })
})
