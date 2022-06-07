import fs from "fs"
import "jest-xml-matcher"
import generateMessage from "tests/helpers/generateMessage"
import processMessage from "tests/helpers/processMessage"
import MockDate from "mockdate"

describe("generateLegacyAhoXml", () => {
  it.ifNewBichard("should generate legacy xml from aho", async () => {
    MockDate.set(new Date("2022-06-06").getTime())

    const xml = fs.readFileSync("test-data/generated-aho.xml").toString()

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { ahoXml } = await processMessage(inputMessage)

    expect(ahoXml).toEqualXML(xml)

    MockDate.reset()
  })
})
