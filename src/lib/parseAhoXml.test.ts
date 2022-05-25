import parseAhoXml from "./parseAhoXml"
import fs from "fs"
import type { AhoParsedXml } from "src/types/AhoParsedXml"

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
    const result = parseAhoXml(inputXml) as AhoParsedXml

    expect(result.AnnotatedHearingOutcome).toStrictEqual({})
  })
})
