jest.setTimeout(30000)

import { TriggerCode } from "src/types/TriggerCode"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

const code = TriggerCode.TRPR0015
const resultCode = 4592
const otherTriggerCode = TriggerCode.TRPR0010
const otherResultCode = 4597

describe("TRPR0015", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a case level trigger if another trigger is generated when the case is recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }] }, { results: [{ code: otherResultCode }] }]
    })

    // Process the mock message
    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code: otherTriggerCode }, { code }])
  })

  it("should generate a case level trigger if another trigger is not generated when the case is recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    // Process the mock message
    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a case level trigger if another trigger is generated when the case is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        { results: [{ code: resultCode }], recordable: false },
        { results: [{ code: otherResultCode }], recordable: false }
      ]
    })

    // Process the mock message
    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code: otherTriggerCode }, { code }])
  })

  it("should not generate a case level trigger if another trigger is not generated when the case is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }], recordable: false }]
    })

    // Process the mock message
    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      recordable: false,
      expectTriggers: false,
      expectRecord: false
    })

    // Check the right triggers are generated
    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })
})
