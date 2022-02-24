jest.setTimeout(30000)

import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

const code = TriggerCode.TRPR0002
const resultCode = 4575
const resultQualifier = "EO"

describe("TRPR0002", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger for a single offence without the EO result qualifier", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: resultCode }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger for a single offence with the EO result qualifier", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: resultCode, qualifier: resultQualifier }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { expectTriggers: false, expectRecord: false })

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should generate a single case trigger for multiple offences without the EO result qualifier", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }] }, { results: [{ code: resultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate a trigger for multiple offences with the EO result qualifier", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        { results: [{ code: resultCode, qualifier: resultQualifier }] },
        { results: [{ code: resultCode, qualifier: resultQualifier }] }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { expectTriggers: false, expectRecord: false })

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should generate a trigger for multiple offences with one EO result qualifier and one without", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: resultCode, qualifier: resultQualifier }]
        },
        { results: [{ code: resultCode }] }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is not recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }], recordable: false }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, { recordable: false })

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger when record is recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: resultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })
})
