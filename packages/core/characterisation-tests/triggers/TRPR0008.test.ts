import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import { SpiPlea } from "../../types/Plea"
import { SpiVerdict } from "../../types/Verdict"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0008
const matchingOffenceCode = "BA76004"

describe.ifPhase1("TRPR0008", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a case trigger for a single guilty offence with a matching offence code", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.Guilty,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a case trigger for a single offence with a matching offence code and plea of Admits", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.NotGuilty,
          results: [{ code: 1015 }],
          plea: SpiPlea.Admits
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger if only the offence code matches", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.NotGuilty,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger if the offence code matches and another offence is guilty", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.NotGuilty,
          results: [{ code: 1015 }]
        },
        {
          code: "CJ88116",
          finding: SpiVerdict.Guilty,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger if there is no result", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.NotGuilty,
          results: []
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
  })

  it("should only generate a single case level trigger for multiple matching offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.Guilty,
          results: [{ code: 1015 }]
        },
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.Guilty,
          results: [{ code: 1015 }]
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when the record is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: matchingOffenceCode,
          finding: SpiVerdict.Guilty,
          results: [{ code: 1015 }],
          recordable: false
        }
      ]
    })

    const { triggers } = await processPhase1Message(inputMessage, { recordable: false })

    expect(triggers).toStrictEqual([{ code }])
  })
})
