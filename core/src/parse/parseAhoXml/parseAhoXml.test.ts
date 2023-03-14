import fs from "fs"
import "jest-xml-matcher"
import parseAhoXml from "./parseAhoXml"

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
    const parsedAho = parseAhoXml(inputXml)

    expect(parsedAho).toMatchSnapshot()
  })
})
