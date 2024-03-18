import "jest-xml-matcher"
import MockDate from "mockdate"
import generateMessage from "../../tests/helpers/generateMessage"
import processMessage from "../../tests/helpers/processMessage"
import serialiseToXml from "./serialiseToXml"
import type Phase1Result from "../../types/Phase1Result"

describe("generateLegacyAhoXml", () => {
  it.ifNewBichard("should generate legacy xml with validations from an aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { hearingOutcome } = (await processMessage(inputMessage)) as Phase1Result
    const ahoXml = serialiseToXml(hearingOutcome)

    expect(ahoXml).toMatchSnapshot()

    MockDate.reset()
  })

  it.ifNewBichard("should generate legacy xml without validations from an aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { hearingOutcome } = (await processMessage(inputMessage)) as Phase1Result
    const hoXml = serialiseToXml(hearingOutcome, false)

    expect(hoXml).toMatchSnapshot()

    MockDate.reset()
  })
})
