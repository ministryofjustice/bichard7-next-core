import fs from "fs"
import "jest-xml-matcher"
import generateMessage from "tests/helpers/generateMessage"
import processMessage from "tests/helpers/processMessage"

describe("generateLegacyAhoXml", () => {
  it("should generate legacy xml from aho", async () => {
    const xml = fs.readFileSync("test-data/generated-aho.xml").toString()

    const inputMessage = generateMessage({
      offences: [{ results: [{}] }, { results: [{}] }]
    })
    const { ahoXml } = await processMessage(inputMessage)

    expect(ahoXml).toEqualXML(xml)
  })
})
