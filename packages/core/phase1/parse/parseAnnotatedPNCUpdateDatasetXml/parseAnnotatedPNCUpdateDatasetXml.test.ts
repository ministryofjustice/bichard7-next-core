import fs from "fs"
import "jest-xml-matcher"
import parseAnnotatedPNCUpdateDatasetXml from "phase1/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"

describe("parseAnnotatedPNCUpdateDatasetXml", () => {
  it("converts XML to AnnotatedPNCUpdateDatasetXml", () => {
    const inputXml = fs.readFileSync("phase1/tests/fixtures/AnnotatedPNCUpdateDataset.xml").toString()
    const parsedAnnotatedPNCUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(inputXml)

    expect(parsedAnnotatedPNCUpdateDataset).toMatchSnapshot()
  })
})
