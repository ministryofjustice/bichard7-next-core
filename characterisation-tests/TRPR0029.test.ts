jest.setTimeout(30000)

import { TriggerCode } from "../src/types/TriggerCode"
import generateMessage from "./helpers/generateMessage"
import PostgresHelper from "./helpers/PostgresHelper"
import processMessage from "./helpers/processMessage"

const code = TriggerCode.TRPR0029
const offenceCode = "AS14511"
const offenceCodeForGranted = "CD98516"

describe("TRPR0029", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a trigger for offence with the correct offence code", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1015 }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, true)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate a trigger for offence with the correct offence code and 'granted' result text", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCodeForGranted,
          results: [{ code: 1015, text: "contains word granted" }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, true)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should generate one trigger for multiple offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
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

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, true)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code }])
  })

  it("should not generate trigger for offence when result text does not contain 'granted'", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCodeForGranted,
          results: [{ code: 1015, text: "not containing word g_r_a_n_t_e_d" }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, false, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })

  it("should not generate a trigger when record is recordable", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          code: offenceCode,
          results: [{ code: 1015 }]
        }
      ]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage, true, false)

    // Check the right triggers are generated
    expect(triggers).toHaveLength(0)
  })
})
