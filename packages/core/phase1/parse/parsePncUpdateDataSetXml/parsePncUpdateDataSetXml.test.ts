import fs from "fs"
import "jest-xml-matcher"
import parsePncUpdateDataSetXml from "./parsePncUpdateDataSetXml"

describe("parsePncUpdateDataSetXml", () => {
  it("converts XML to PncUpdateDataSet when operations exist", () => {
    const inputXml = fs.readFileSync("phase1/tests/fixtures/PncUpdateDataSet01.xml").toString()
    const parsedAho = parsePncUpdateDataSetXml(inputXml)

    expect(parsedAho).toMatchSnapshot()
  })
})
