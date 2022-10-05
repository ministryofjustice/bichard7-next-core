import fs from "fs"
import "jest-xml-matcher"
import parseAnnotatedPNCUpdateDatasetXml from "./parseAnnotatedPNCUpdateDatasetXml"

describe("parseAnnotatedPNCUpdateDatasetXml", () => {
  it("converts XML to AnnotatedPNCUpdateDatasetXml", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedPNCUpdateDataset.xml").toString()
    const parsedAnnotatedPNCUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(inputXml)

    expect(parsedAnnotatedPNCUpdateDataset).toMatchSnapshot()
  })
})
