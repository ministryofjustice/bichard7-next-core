jest.setTimeout(30000)

import { TriggerCode } from "src/types/TriggerCode"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

const code = TriggerCode.TRPR0010
const resultCode = 4597
const resultQualifier = "LI"

describe("TRPR0010", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger for a single offence with matching resultCode", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    // Process the mock message
    const result = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for a single offence with the matching result qualifier", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1015, qualifier: resultQualifier }] }]
    })

    // Process the mock message
    const result = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for a result with bail conditions", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      bailConditions: "Some bail conditions",
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const result = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toStrictEqual([{ code }])
  })

  it("should not generate the trigger if the defendant is in custody", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      bailStatus: "C",
      offences: [{ results: [{ code: resultCode }] }]
    })

    // Process the mock message
    const result = await processMessage(inputMessage, { expectTriggers: false, expectRecord: false })

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toHaveLength(0)
  })

  it("should only generate one trigger for multiple matching conditions", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        { code: "TH68006", results: [{ code: resultCode }] },
        { results: [{ code: 1015, qualifier: resultQualifier }] }
      ],
      bailConditions: "Some bail conditions"
    })

    // Process the mock message
    const result = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when the result is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }], recordable: false }]
    })

    // Process the mock message
    const result = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(result.exceptions).toHaveLength(0)
    expect(result.triggers).toStrictEqual([{ code }])
  })
})
