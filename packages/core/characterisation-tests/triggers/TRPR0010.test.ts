import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0010
const resultCode = 4597
const resultQualifier = "LI"

describe.ifPhase1("TRPR0010", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger for a single offence with matching resultCode", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([])
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for a single offence with the matching result qualifier", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015, qualifier: resultQualifier }] }]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([])
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for a result with bail conditions", async () => {
    const inputMessage = generateSpiMessage({
      bailConditions: "Some bail conditions",
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([])
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate the trigger if the defendant is in custody", async () => {
    const inputMessage = generateSpiMessage({
      bailStatus: "C",
      offences: [{ results: [{ code: resultCode }] }]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { expectRecord: false })

    expect(triggers).toHaveLength(0)
    expect(exceptions).toHaveLength(0)
  })

  it("should only generate one trigger for multiple matching conditions", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { code: "TH68006", results: [{ code: resultCode }] },
        { results: [{ code: 1015, qualifier: resultQualifier }] }
      ],
      bailConditions: "Some bail conditions"
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([])
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when the result is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }], recordable: false }]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { recordable: false })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code }])
  })
})
