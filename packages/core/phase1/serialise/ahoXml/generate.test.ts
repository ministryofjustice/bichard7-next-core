import "jest-xml-matcher"
import MockDate from "mockdate"
import generateMessage from "phase1/tests/helpers/generateMessage"
import processMessage from "phase1/tests/helpers/processMessage"
import type { Phase1SuccessResult } from "phase1/types/Phase1Result"
import convertAhoToXml from "phase1/serialise/ahoXml/generate"

describe("generateLegacyAhoXml", () => {
  it.ifNewBichard("should generate legacy xml with validations from an aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { hearingOutcome } = (await processMessage(inputMessage)) as Phase1SuccessResult
    const ahoXml = convertAhoToXml(hearingOutcome)

    expect(ahoXml).toMatchSnapshot()

    MockDate.reset()
  })

  it.ifNewBichard("should generate legacy xml without validations from an aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { hearingOutcome } = (await processMessage(inputMessage)) as Phase1SuccessResult
    const hoXml = convertAhoToXml(hearingOutcome, false)

    expect(hoXml).toMatchSnapshot()

    MockDate.reset()
  })
})
