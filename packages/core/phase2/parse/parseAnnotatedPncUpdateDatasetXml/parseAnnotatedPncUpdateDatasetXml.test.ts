import fs from "fs"
import "jest-xml-matcher"
import parseAnnotatedPNCUpdateDatasetXml from "./parseAnnotatedPncUpdateDatasetXml"

describe("parseAnnotatedPNCUpdateDatasetXml", () => {
  it("converts XML to AnnotatedPNCUpdateDatasetXml", () => {
    const inputXml = fs.readFileSync("phase2/tests/fixtures/AnnotatedPncUpdateDataset.xml").toString()
    const parsedAnnotatedPNCUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(inputXml)

    expect(parsedAnnotatedPNCUpdateDataset).toMatchSnapshot()
  })
})
