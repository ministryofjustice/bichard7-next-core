import fs from "fs"
import "jest-xml-matcher"
import parseAhoXml from "phase1/parse/parseAhoXml/parseAhoXml"

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("phase1/tests/fixtures/AnnotatedHO1.xml").toString()
    const parsedAho = parseAhoXml(inputXml)

    expect(parsedAho).toMatchSnapshot()
  })
})
