jest.setTimeout(30000)

import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

const code = TriggerCode.TRPR0030
const offenceCode = "PL84504"

describe("TRPR0030", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger correctly with single non-recordable offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ code: offenceCode, results: [{ code: 1015 }], recordable: false }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a single case level trigger with multiple non-recordable offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        { code: offenceCode, results: [{ code: 1015 }], recordable: false },
        { code: offenceCode, results: [{ code: 1015 }], recordable: false },
        { code: offenceCode, results: [{ code: 1015 }], recordable: false }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger when record is recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ code: offenceCode, results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { expectTriggers: false, expectRecord: false })

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })
})
