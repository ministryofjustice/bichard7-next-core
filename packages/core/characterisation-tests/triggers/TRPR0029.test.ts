import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0029
const offenceCode = "AS14511"
const offenceCodeForGranted = "CD98516"

describe.ifPhase1("TRPR0029", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger for offence with the correct offence code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for offence with the correct offence code and 'granted' result text", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCodeForGranted,
          results: [{ code: 1015, text: "contains word granted" }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate one trigger for multiple offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCodeForGranted,
          results: [{ code: 1015, text: "granted" }]
        },
        {
          code: offenceCode,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate trigger for offence when result text does not contain 'granted'", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCodeForGranted,
          results: [{ code: 1015, text: "not containing word g_r_a_n_t_e_d" }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      recordable: false
    })

    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger when record is recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, {
      recordable: true,
      expectRecord: false
    })

    expect(triggers).toHaveLength(0)
  })
})
