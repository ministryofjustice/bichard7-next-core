import fs from "fs"
import "jest-xml-matcher"
import convertAhoToXml from "./generateAhoXml"
import parseAhoXml from "./parseAhoXml"

// TODO fix this method because it removes white spaces where it shouldn't...
const removeWhiteSpaceFromString = (input: string): string => {
  return input.replace(/\s+/g, "")
}

const matchXMLField = (xml: string, field: string): string => {
  const regex = new RegExp(`(?<=\<${field}>)(.*?)(?=\<\/${field}>)`)
  const result = removeWhiteSpaceFromString(xml).match(regex)

  return result ? result[0] : ""
}

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
    const parsedAho = parseAhoXml(inputXml)
    const resultXml = convertAhoToXml(parsedAho)

    expect(matchXMLField(resultXml, "ds:TopLevelCode")).toEqual(matchXMLField(inputXml, "ds:TopLevelCode"))
    expect(matchXMLField(resultXml, "br7:SourceReference")).toEqualXML(matchXMLField(inputXml, "br7:SourceReference"))
    expect(matchXMLField(resultXml, "br7:HearingOutcome")).toEqualXML(matchXMLField(inputXml, "br7:HearingOutcome"))
  })
})
