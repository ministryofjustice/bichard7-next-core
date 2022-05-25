import parseAhoXml from "./parseAhoXml"
import fs from "fs"

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
    const result = parseAhoXml(inputXml)

    expect(result.AnnotatedHearingOutcome).toStrictEqual({})
  })
})
