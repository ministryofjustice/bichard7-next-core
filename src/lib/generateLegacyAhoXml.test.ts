import fs from "fs"
import "jest-xml-matcher"
import MockDate from "mockdate"
import generateMessage from "tests/helpers/generateMessage"
import processMessage from "tests/helpers/processMessage"
import convertAhoToXml from "./generateLegacyAhoXml"

describe("generateLegacyAhoXml", () => {
  it.ifNewBichard("should generate legacy xml from aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const xml = fs.readFileSync("test-data/generated-aho.xml").toString()

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { hearingOutcome } = await processMessage(inputMessage)
    const ahoXml = convertAhoToXml(hearingOutcome)

    expect(ahoXml).toEqualXML(xml)

    MockDate.reset()
  })
})
