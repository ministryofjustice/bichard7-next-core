import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0015
const resultCode = 4592
const otherTriggerCode = TriggerCode.TRPR0010
const otherResultCode = 4597

describe.ifPhase1("TRPR0015", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a case level trigger if another trigger is generated when the case is recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }] }, { results: [{ code: otherResultCode }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code: otherTriggerCode }, { code }])
  })

  it("should generate a case level trigger if another trigger is not generated when the case is recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a case level trigger if another trigger is generated when the case is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { recordable: false, results: [{ code: resultCode }] },
        { recordable: false, results: [{ code: otherResultCode }] }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage, { recordable: false })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code: otherTriggerCode }, { code }])
  })

  it("should not generate a case level trigger if another trigger is not generated when the case is not recordable", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ recordable: false, results: [{ code: resultCode }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      recordable: false
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })
})
